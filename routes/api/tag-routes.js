const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          required: false,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
          through: { attributes: ['id', 'product_id', 'tag_id'] },
        },
      ]
    });

    if(!tags) {
      return res.status(404).json({ message: "No tag data in database" });
    }

    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Product,
          required: false,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
          through: { attributes: ['id', 'product_id', 'tag_id'] },
        },
      ]
    });

    if(!tag) {
      return res.status(404).json({ message: `No tag with id of ${req.params.id} in database` });
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);

    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const newTag = await Tag.update(req.body, { where: { id: req.params.id } });

    if(!newTag) {
      res.status(404).json({ message: `Could not find tag with ID of: ${req.params.id}` })
    }

    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tag = await Tag.destroy({ where: { id: req.params.id } });

    if(!tag) {
      return res.status(404).json({ message: `No tag with ID of: ${req.params.id} in database` });
    }

    res.status(200).json("Successfully deleted tag!");
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
