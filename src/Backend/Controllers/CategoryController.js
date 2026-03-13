// ========================================
// Import Category Model
// ========================================
const Category = require("../Models/Category");


// ========================================
// Get All Categories
// ========================================
exports.getAllCategory = async (req, res) => {
    try {
        // Fetch all categories
        const categories = await Category.find({});

        // If no category found
        if (categories.length === 0) {
            return res.status(404).json({
                message: "Category not found!"
            });
        }

        // Send category list
        res.status(200).json(categories);

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};


// ========================================
// Add New Category
// ========================================
exports.addCategory = async (req, res) => {
    try {
        const { Name } = req.body;

        // Check if category already exists
        const existing = await Category.findOne({ Name });
        if (existing) {
            return res.status(400).json({
                message: "Category already exists!"
            });
        }

        // Create new category
        const newCategory = new Category({ Name });
        await newCategory.save();

        // Send success response
        res.status(201).json({
            message: "Category added successfully!",
            data: newCategory
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Update Category
// ========================================
exports.updateCategory = async (req, res) => {
    try {
        const { Name } = req.body;

        // Check duplicate name except current ID
        const duplicate = await Category.findOne({
            Name,
            _id: { $ne: req.params.id }
        });

        if (duplicate) {
            return res.status(400).json({
                message: "Category already exists!"
            });
        }

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { Name },
            { new: true, runValidators: true }
        );

        // If category not found
        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found!"
            });
        }

        // Send updated data
        res.status(200).json({
            message: "Category updated successfully!",
            data: updatedCategory
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// ========================================
// Delete Category
// ========================================
exports.deleteCategory = async (req, res) => {
    try {
        // Delete category by ID
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        // If category not found
        if (!deletedCategory) {
            return res.status(404).json({
                message: "Category not found!"
            });
        }

        // Success response
        res.status(200).json({
            message: "Category deleted successfully!"
        });

    } catch (err) {
        // Handle server error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};