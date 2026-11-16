const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function iniciarWorker() {
    const conexion = await amqp.connect(
        RABBITMQ_URL
    );

    const canal = await conexion.createChannel();

    await canal.assertQueue("pedidos", {
        durable: true
    });

    canal.prefetch(1);

    console.log("Worker esperando pedidos...");

    await canal.consume("pedidos", (mensaje) => {
        if(mensaje !== null){
            try{
                const evento = JSON.parse(
                    mensaje.content.toString()
                );
  
                if(evento.tipo !== "PedidoCreado"){
                    throw new Error("Tipo de evento no reconocido");
                }

                const pedido = evento.datos;

                console.log("Evento recibido:", evento.tipo);
                console.log("Pedido:", pedido);

                console.log(
                    `Procesando ${pedido.cantidad} unidad(es) de ${pedido.producto}`
                );

                console.log("Pedido procesando correctamente");

                canal.ack(mensaje);
            } catch(error){
                console.error("Error:", error.message);

                canal.nack(mensaje, false, false);
            }
        }
    }, {
        noAck: false
    });
}

iniciarWorker().catch(console.error);