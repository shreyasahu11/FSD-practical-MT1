const express = require("express");

const app = express();
const PORT = 3000;


app.use(express.json());


let products = [
    {
        id: 301,
        name: "Wireless Mouse",
        category: "Electronics",
        price: 799,
        quantity: 25,
        inStock: true
    },
    {
        id: 302,
        name: "Notebook",
        category: "Stationery",
        price: 60,
        quantity: 100,
        inStock: true
    },
    {
        id: 303,
        name: "USB Keyboard",
        category: "Electronics",
        price: 999,
        quantity: 0,
        inStock: false
    }
];


// 1. GET all products
app.get("/api/products", (req, res) => {
    res.status(200).json(products);
});


// 2. POST a new product
app.post("/api/products", (req, res) => {
    const { name, category, price, quantity, inStock } = req.body;

    // Validation
    if (
        !name ||
        !category ||
        price === undefined ||
        quantity === undefined ||
        inStock === undefined
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (
        typeof name !== "string" ||
        typeof category !== "string" ||
        typeof price !== "number" ||
        typeof quantity !== "number" ||
        typeof inStock !== "boolean"
    ) {
        return res.status(400).json({
            message: "Invalid data types"
        });
    }

    // Generate unique ID
    const newId =
        products.length > 0
            ? Math.max(...products.map(product => product.id)) + 1
            : 301;

    const newProduct = {
        id: newId,
        name,
        category,
        price,
        quantity,
        inStock
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});


// 3. GET product by ID
app.get("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(product => product.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json(product);
});


// 4. PUT / update product
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const { name, category, price, quantity, inStock } = req.body;

    // Validation
    if (
        !name ||
        !category ||
        price === undefined ||
        quantity === undefined ||
        inStock === undefined
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (
        typeof name !== "string" ||
        typeof category !== "string" ||
        typeof price !== "number" ||
        typeof quantity !== "number" ||
        typeof inStock !== "boolean"
    ) {
        return res.status(400).json({
            message: "Invalid data types"
        });
    }

    products[productIndex] = {
        id,
        name,
        category,
        price,
        quantity,
        inStock
    };

    res.status(200).json(products[productIndex]);
});


// 5. DELETE product
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products.splice(productIndex, 1);

    res.status(200).json({
        message: "Product deleted successfully"
    });
});


// 6. Filter products by category
// IMPORTANT: Keep this route before /:id
app.get("/api/products/filter", (req, res) => {
    const category = req.query.category;

    const filteredProducts = products.filter(
        product =>
            product.category.toLowerCase() === category.toLowerCase()
    );

    res.status(200).json(filteredProducts);
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});