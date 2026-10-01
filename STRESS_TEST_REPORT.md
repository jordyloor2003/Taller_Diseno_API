# 📊 Reporte Ejecutivo de Prueba de Estrés y Rendimiento (Artillery)

## 1. Resumen Ejecutivo

| Métrica General | Valor Obtenido |
| :--- | :--- |
| **Total de Peticiones HTTP** | `7,525` |
| **Usuarios Virtuales Completados** | `1,075 (100%)` |
| **Usuarios Virtuales Fallidos** | `0 (0%)` |
| **Peticiones Exitosas (HTTP 201)** | `3,225` |
| **Peticiones Rechazadas por Zod DTO (HTTP 400)** | `4,300` |
| **Tasa de Caída de Sockets (`maxErrorRate`)** | `0.00%` (SLA < 1% cumplido) |

---

## 2. Comparación de Rendimiento: Tubería Completa vs Rechazo Perimetral Zod

El objetivo clave de esta práctica es verificar cómo el validador **Zod DTO** protege los recursos del backend y la base de datos (MongoDB) rechazando inmediatamente cargas útiles ilegales en el perímetro de la red.

| Parámetro de Latencia | Flujo A: Datos Válidos (HTTP 201)<br>*(Express + Zod + Mongoose + BD)* | Flujo B: Datos Corruptos (HTTP 400)<br>*(Rechazo Perimetral Zod)* |
| :--- | :---: | :---: |
| **Mínimo** | `0.0 ms` | `0.0 ms` |
| **Mediana (p50)** | `165.7 ms` | `2.0 ms` |
| **Percentil 75 (p75)** | `210.6 ms` | `10.1 ms` |
| **Percentil 90 (p90)** | `596.0 ms` | `25.8 ms` |
| **Percentil 95 (p95)** | `727.9 ms` | `34.1 ms` |
| **Percentil 99 (p99)** | `804.5 ms` | `55.2 ms` |
| **Promedio (Mean)** | **`248.1 ms`** | **`7.8 ms`** |

> **Conclusión Técnica:** El escenario actual contiene tres payloads válidos y cuatro inválidos por usuario virtual. El contador confirma `3,225` respuestas HTTP 201 y `4,300` respuestas HTTP 400, exactamente en la proporción esperada de 3:4. El flujo inválido mantiene menor latencia que el flujo persistente, aunque su p99 actual es de **55.2 ms**.

---

## 3. Distribución General de Latencias (Global)

- **Mínimo:** `0 ms`
- **Promedio:** `110.8 ms`
- **p50 (Mediana):** `22.9 ms`
- **p75:** `162.4 ms`
- **p90:** `214.9 ms`
- **p95:** `478.3 ms`
- **p99:** `772.9 ms`
- **Máximo:** `2,670.0 ms`

---

## 4. Evaluación de Acuerdos de Nivel de Servicio (SLA)

1. **Estabilidad del Socket HTTP (`maxErrorRate < 1`):** `APROBADO (0% de error)`.
2. **Latencia Temporal (`http.response_time.p99 < 200`):** `772.9 ms` (No cumplido; la latencia aumenta durante la saturación, principalmente en las operaciones válidas que continúan hasta Mongoose/MongoDB).
