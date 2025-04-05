const Category = require("../models/Category");

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

const createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({ message: "Category created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create category" });

    }
};

module.exports={createCategory,getCategories}