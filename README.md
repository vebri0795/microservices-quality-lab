# Fase 1 — Fundamentos + primer microservicio

Dos servicios: `inventory-service` y `orders-service`. `orders-service` recibe
pedidos y le pregunta a `inventory-service` si hay stock antes de confirmar.

El boilerplate (servidor Express, rutas, Docker, tsconfig) ya está montado
para que no pierdas tiempo ahí. Lo que falta por implementar son dos
funciones de lógica pura — justo las piezas que se testean unitariamente.

## Qué tienes que hacer

1. `cd inventory-service && npm install`
2. Abre `src/inventoryLogic.ts` y completa `reserveStock` (las reglas están
   en el comentario TODO justo encima de la función).
3. Corre `npm test` — los tests de `reserveStock` deben pasar en verde.
4. Repite lo mismo en `orders-service`: `npm install`, completa
   `calculateTotal` en `src/orderLogic.ts`, corre `npm test`.
5. Cuando ambos `npm test` pasen, levanta todo junto desde la raíz:
   ```
   docker-compose up --build
   ```
6. Prueba el flujo completo:
   ```
   curl -X POST http://localhost:4000/orders \
     -H "Content-Type: application/json" \
     -d '{"sku":"sku-1","quantity":2}'
   ```
   Deberías recibir un 201 con el total calculado.

## Definición de "terminado" para esta fase

- [ ] `npm test` pasa en los dos servicios sin tocar los archivos `.test.ts`
- [ ] `docker-compose up` levanta ambos servicios sin errores
- [ ] La petición curl de arriba responde 201 con el total correcto
- [ ] Puedes explicar en una frase la diferencia entre lo que testea
      `orderLogic.test.ts` (unitario, con todo mockeado) y lo que
      probarías si hicieras que los dos servicios se hablen de verdad
      (eso es la Fase 2)

## Siguiente paso

Cuando lo tengas, dime "terminé la fase 1" y revisamos tu implementación
antes de pasar a integration tests + contract testing con Pact.
