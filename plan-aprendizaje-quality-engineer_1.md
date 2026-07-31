# Plan de aprendizaje: de cero en microservicios a candidato sólido

**Stack elegido:** TypeScript + Node.js + Express + Jest + Docker + GitHub Actions + Pact (contract testing)
**Ritmo:** 8+ horas/semana → 5 fases, aprox. 1 semana cada una (ajustable)
**Formato de trabajo:** al empezar cada fase, dime "vamos con la fase X" y te ayudo a diseñar el esqueleto, revisar tu código, resolver dudas y preparar cómo defenderlo en entrevista.

Todas las fases giran alrededor de los mismos dos servicios de juguete, para que el proyecto crezca de forma coherente en vez de ser piezas sueltas:

- `orders-service` — recibe pedidos
- `inventory-service` — dice si hay stock

---

## Fase 1 — Fundamentos + primer microservicio
**Cubre del posting:** Strong Coding Fundamentals · Containerization Knowledge

- Construir `orders-service` e `inventory-service` en TypeScript/Express (endpoints simples, lógica de negocio mínima: validar pedido, calcular total, chequear stock).
- Un `Dockerfile` por servicio.
- Tests unitarios con Jest para la lógica interna, mockeando cualquier dependencia externa.

**Entregable:** ambos servicios corren con `docker-compose up`, `npm test` pasa en los dos.

---

## Fase 2 — Comunicación entre servicios: integration + contract tests
**Cubre del posting:** Microservices Expertise

- **Integration test:** levantar `inventory-service` real vía docker-compose y probar que `orders-service` le habla correctamente por HTTP (nada de mocks aquí).
- **Contract test con Pact:** desde `orders-service` (consumidor) generar el contrato de lo que espera de `inventory-service`; verificarlo contra el proveedor real.

**Entregable:** conjunto de integration + contract tests corriendo localmente, y puedes explicar la diferencia entre ambos con tus propias palabras.

---

## Fase 3 — CI/CD con quality gates (GitHub Actions)
**Cubre del posting:** Champion GitOps (parte CI) · Set Standards

- `.github/workflows/ci.yml` con etapas: lint → build → unit tests → contract tests → build de imagen Docker.
- El pipeline debe **bloquear el merge** si algo falla — eso es literalmente un "quality gate".
- Opcional: publicar la imagen en GitHub Container Registry.

**Entregable:** badge de CI en el README + una PR de prueba donde rompes un test a propósito y ves que el pipeline lo bloquea.

---

## Fase 4 — Testing en aislamiento: component tests y virtualización
**Cubre del posting:** Build Tools · Evolve Architecture (testability)

- Usar un mock server (MSW o similar) para simular `inventory-service` y probar `orders-service` completamente aislado.
- Construir una pequeña herramienta interna: una librería compartida que genera datos de prueba consistentes para ambos servicios. Esto es exactamente lo que significa "Build Tools" en la oferta.

**Entregable:** suite de component tests + librería de test-data documentada y reutilizable entre los dos servicios.

---

## Fase 5 — GitOps y end-to-end (nivel stretch / "plus factor")
**Cubre del posting:** Champion GitOps (parte CD/ArgoCD) · Evolve Architecture

- Levantar un cluster local (kind o k3d).
- Desplegar ambos servicios con ArgoCD siguiendo el patrón GitOps (el repo Git como fuente de verdad, no `kubectl apply` manual).
- 1-2 tests end-to-end contra los servicios reales ya desplegados en el cluster.

**Entregable:** repo con manifiestos de Kubernetes + configuración de ArgoCD + captura del pipeline sincronizando.

---

## Cierre: convertirlo en portfolio
- Un README a nivel raíz que explique la arquitectura, la pirámide de tests aplicada y por qué tomaste cada decisión (esto entrena directamente "Communication Skills").
- 3-4 historias breves en formato STAR, una por fase, listas para la entrevista.

---

### Progreso
- [x] Fase 1 — Fundamentos + primer microservicio
- [x] Fase 2 — Integration + contract tests
- [ ] Fase 3 — CI/CD con quality gates
- [ ] Fase 4 — Component tests + virtualización
- [ ] Fase 5 — GitOps + end-to-end
