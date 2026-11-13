# Sistema de Gestión de Pedidos

Proyecto educativo para aprender arquitectura Event-Driven,
Node.js, RabbitMQ, Git, Docker y CI/CD.

## Objetivo

Desarrollar una API de pedidos que publique mensajes
en RabbitMQ y un consumidor que los procese.

## Tecnologías

- JavaScript
- Node.js
- RabbitMQ
- Docker
- Git y GitHub
- GitHub Actions
- Jenkins
- GHCR

## Estado

En desarrollo.

## Arquitectura

El sistema utiliza comunicación asíncrona mediante RabbitMQ.

### Componentes

- API de Pedidos: publica eventos.
- RabbitMQ: recibe y enruta mensajes.
- Worker: consume y procesa los mensajes.