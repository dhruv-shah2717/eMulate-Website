import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Category = () => {

    // ========================================
    // State Management
    // ========================================
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");    
    const [error, setError] = useState("");

    const [editCategory, setEditCategory] = useState({ id: "", name: "" }); 
    const [updateError, setUpdateError] = useState("");


    // ========================================
    // Fetch All Categories from Server
    // ========================================
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/category`);
            const data = await response.json();

            if (response.ok) {
                setCategories(Array.isArray(data) ? data : []);
            } else {
                setCategories([]);
            }

        } catch (err) {
            console.error(err);
            setCategories([]);
        }
    };


    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);


    // ========================================
    // Handle Input Change for New Category
    // ========================================
    const handleInputChange = (e) => {
        const value = e.target.value;
        setCategoryName(value);

        // Validation: at least 3 characters
        setError(value.length > 0 && value.length < 3 ? "At least 3 characters required." : "");
    };


    // ========================================
    // Add New Category
    // ========================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (categoryName.length < 3) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/category/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ Name: categoryName }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                setCategoryName("");
                fetchCategories();
            } else {
                toast.error(result.message);
            }

        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Delete a Category
    // ========================================
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/category/delete/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                fetchCategories();
            } else {
                toast.error(result.message);
            }

        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Open Edit Modal
    // ========================================
    const handleEditClick = (cat) => {
        setEditCategory({ id: cat._id, name: cat.Name || cat.name });
        setUpdateError("");
    };


    // ========================================
    // Update Category
    // ========================================
    const handleUpdate = async () => {
        if (editCategory.name.length < 3) {
            setUpdateError("Name must be at least 3 characters.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/category/update/${editCategory.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ Name: editCategory.name }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                fetchCategories();
                document.getElementById("closeModal").click(); // Close modal
            } else {
                toast.error(result.message);
            }

        } catch (err) {
            console.error(err)
        }
    };


    // ========================================
    // JSX Rendering
    // ========================================
    return (
        <div className="dashboard-content">

            {/* ================= Category Card ================= */}
            <div className="table-card glass-card">

                {/* Card Header */}
                <div className="card-title card-header">
                    <h3>Categories Add, Update, Delete</h3>
                </div>

                {/* Add Category Form */}
                <div className="container mt-4 mb-4">
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <label className="form-label">Enter Category Name</label>
                            <input
                                type="text"
                                className={`form-control ${error ? "is-invalid" : ""}`}
                                placeholder="Ex: Fun Event"
                                value={categoryName}
                                onChange={handleInputChange}
                            />
                            {error && <div className="text-danger mt-1 small">{error}</div>}
                        </div>

                        <div className="col-12">
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                                disabled={categoryName.length < 3}
                            >
                                Add Category
                            </button>
                        </div>
                    </form>
                </div>

                {/* Category Table */}
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Category Name</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((cat, index) => (
                                    <tr key={cat._id}>
                                        <td>{index + 1}</td>
                                        <td>{cat.Name || cat.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm"
                                                data-bs-toggle="modal"
                                                data-bs-target="#updateModal"
                                                onClick={() => handleEditClick(cat)}
                                            >
                                                Update
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(cat._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No Categories Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Decorative Borders */}
                <div className="offer-border-top"></div>
                <div className="offer-border-bottom"></div>
            </div>

            {/* ================= Update Modal ================= */}
            <div className="modal fade" id="updateModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title">Update Category</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                id="closeModal"
                                aria-label="Close"
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Enter Category Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${updateError ? "is-invalid" : ""}`}
                                    value={editCategory.name}
                                    onChange={(e) =>
                                        setEditCategory({ ...editCategory, name: e.target.value })
                                    }
                                />
                                {updateError && <div className="text-danger mt-1 small">{updateError}</div>}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={handleUpdate}
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Category;