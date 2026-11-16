const amqp = require("amqplib");
const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function enviarPedido() {
    const conexion = await amqp.connect(
        RABBITMQ_URL
    );

    const canal = await conexion.createChannel();

    await canal.assertQueue("pedidos", {
        durable: true
    });

    const pedido = {
        producto: "Laptop",
        cantidad: 2
    };

    const mensaje = JSON.stringify(pedido);

    canal.sendToQueue(
        "pedidos",
        Buffer.from(mensaje),
        { persistent: true}
    );

    console.log("Pedido enviado:", pedido);

    await canal.close();
    await conexion.close();
}

enviarPedido().catch(console.error);