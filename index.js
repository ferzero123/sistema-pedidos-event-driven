const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;


app.get("/", (req, res) => {
    res.send("Servidor de pedidos funcionando");
})

app.post("/pedidos", (req, res) => {
    const {producto, cantidad} = req.body || {};

    if(typeof producto !== "string" || producto.trim() === ""){
    return res.status(400).json({
        mensaje: "El producto es obligatorio"
    });
}

if(!Number.isInteger(cantidad) || cantidad <= 0){
    return res.status(400).json({
        mensaje: "La cantidad debe ser un entero mayor que cero"
    });
}

res.json({
        mensaje: "Pedido validado correctamente",
        producto: producto,
        cantidad: cantidad
    });
})


app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
})
