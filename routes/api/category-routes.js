const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  const categoryProducts = [];

  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      raw: true,
      attributes: {
        exclude: ['category_id'],
      },
    });

    if(!categories) {
      return res.status(404).json({ message: "No category data in database" });
    }

    for(let i = 0; i < categories.length; i++){
      const products = await Product.findAll({ raw: true, where: { category_id: categories[i].id } });
      const newObj = {
        ...categories[i],
        products,
      }
      categoryProducts.push(newObj);
    }

    // console.info(categories);

    res.status(200).json(categoryProducts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findOne({ raw: true, where: { id: req.params.id }, attributes: { exclude: ['category_id'] } });
    const products = await Product.findAll({ raw: true, where: { category_id: category.id } });
    if(!category) {
      return res.status(404).json({ message: "No tag data in database" });
    }

    const categoryProducts = {
      ...category,
      products,
    }

    res.status(200).json(categoryProducts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);

    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const newCategory = await Category.update(req.body, { where: { id: req.params.id } });

    if(!newCategory) {
      return res.status(404).json({ message: "No tag data in database" });
    }

    res.status(200).json({ message: "Successfully updated category!" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categories = await Category.destroy({ where: { id: req.params.id } });

    if(!categories) {
      return res.status(404).json({ message: "No tag data in database" });
    }

    res.status(200).json("Successfully deleted category!");
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
