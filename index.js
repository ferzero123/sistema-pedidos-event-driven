const express = require("express");
const amqp = require("amqplib");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const RABBITMQ_URL = process.env.RABBITMQ_URL;

let conexion;
let canal;

async function conectarRabbitMQ() {
    conexion = await amqp.connect(RABBITMQ_URL);

    canal = await conexion.createConfirmChannel();

    await canal.assertQueue("pedidos", {
        durable: true
    });

    console.log("Conectado correctamente a RabbitMQ");
}

app.get("/", (req, res) => {
    res.send("Servidor de pedidos funcionando");
});

app.post("/pedidos", async (req, res) => {
    const { producto, cantidad } = req.body || {};

    if (typeof producto !== "string" || producto.trim() === "") {
        return res.status(400).json({
            mensaje: "El producto es obligatorio"
        });
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        return res.status(400).json({
            mensaje: "La cantidad debe ser un entero mayor que cero"
        });
    }

    const pedido = {
        id: Date.now().toString(),
        producto: producto.trim(),
        cantidad: cantidad
    };

    const evento = {
        tipo: "PedidoCreado",
        datos: pedido
    };

    try {
        canal.sendToQueue(
            "pedidos",
            Buffer.from(JSON.stringify(evento)),
            { persistent: true }
        );

        await canal.waitForConfirms();

        return res.status(202).json({
            mensaje: "Pedido aceptado para procesamiento",
            pedido: pedido
        });
    } catch (error) {
        console.error("Error al publicar pedido:", error.message);

        return res.status(503).json({
            mensaje: "No se pudo confirmar la publicación del pedido"
        });
    }
});

async function iniciarServidor() {
    try {
        await conectarRabbitMQ();

        app.listen(PORT, () => {
            console.log(`Servidor en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar:", error.message);
        process.exit(1);
    }
}

iniciarServidor();
