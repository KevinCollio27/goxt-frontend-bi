# GOxT Cargo — Guía Completa

## ¿Qué es GOxT Cargo?

GOxT Cargo es el sistema de gestión operacional de transporte (TMS) de GOxT. Está diseñado para empresas que ejecutan operaciones de transporte de carga, tanto marítimo como terrestre. Centraliza todo el ciclo operativo: desde la recepción de requerimientos hasta la facturación, pasando por la asignación de flota, seguimiento en tiempo real y gestión documental.

Acceder: [cargo.goxt.io](https://cargo.goxt.io/)

---

## Estructura general de la plataforma

GOxT Cargo está organizado en las siguientes áreas:
- **Mi Cuenta y Cuentas Invitadas** — Gestión de la red de clientes, proveedores y destinatarios
- **Requerimientos** — Solicitudes de transporte y cotizaciones
- **Tripulantes** — Gestión de conductores y tripulación
- **Flotas** — Vehículos y embarcaciones
- **Servicios** — Ejecución operativa, bitácora y telemetría
- **Finanzas** — Órdenes de compra y prefacturas
- **Configuración** — Personalización del workspace

---

## ROLES EN GOxT CARGO

GOxT Cargo maneja distintos perfiles de usuario, cada uno con acceso a diferentes secciones según su función:

| Perfil | Descripción |
|--------|-------------|
| **Administrador** | Acceso completo a todas las secciones |
| **Proveedor de Transporte** | Gestiona flota, tripulantes, servicios y órdenes de compra |
| **Generador de Carga** | Crea requerimientos y gestiona prefacturas |
| **Destinatario** | Visualiza servicios y documentación relacionada |
| **Operador** | Acceso operativo básico, sin finanzas ni configuración |

---

## MI CUENTA

Sección donde el usuario gestiona la información de su propia cuenta dentro del workspace: datos generales, historial de actividad, notas, direcciones asociadas y documentos.

---

## CUENTAS INVITADAS (Red de contactos)

Esta sección centraliza las relaciones comerciales y operativas del workspace. Permite gestionar los distintos tipos de cuentas con las que opera la empresa.

### Generadores de Carga (Clientes)
Empresas o personas que generan las solicitudes de transporte. Son los clientes del servicio.

**¿Qué puedo hacer?**
- Ver el listado de generadores de carga vinculados al workspace
- Acceder al detalle de cada cuenta: historial, documentos, notas y direcciones
- Buscar y filtrar por nombre u otros criterios

### Proveedores de Transporte
Empresas o personas que proveen los vehículos o embarcaciones para ejecutar el transporte.

**¿Qué puedo hacer?**
- Ver y gestionar el listado de proveedores de transporte
- Acceder al detalle con historial, documentos, notas y direcciones

### Destinatarios
Empresas o personas que reciben la carga en destino.

**¿Qué puedo hacer?**
- Gestionar el listado de destinatarios
- Acceder al detalle con historial, documentos, notas y direcciones

### Leads
Prospectos captados a través del Widget IA de GOxT. Aparecen aquí automáticamente cuando un visitante interactúa con el widget y deja sus datos de contacto.

---

## REQUERIMIENTOS

### Cargas (Requerimientos de Transporte)
Los requerimientos son el punto de partida operativo. Representan cada solicitud de transporte que debe ser atendida: qué hay que mover, desde dónde, hacia dónde y con qué condiciones.

**¿Qué puedo hacer en Cargas?**
- Crear requerimientos de transporte de forma manual o a partir de una cotización aprobada en GOxT CRM
- Completar la información de origen, destino, tipo de transporte y detalles de la carga
- Asignar una nave o vehículo disponible al requerimiento
- Ver el estado actualizado de cada requerimiento
- Gestionar documentos asociados a cada carga
- Filtrar por cliente, estado u otros criterios

**¿Cómo creo un requerimiento?**
Ve a *Requerimientos → Cargas* y haz clic en "Nuevo requerimiento". Puedes crearlo de dos formas:
1. **Desde una cotización:** Si el cliente tiene una cotización aprobada en GOxT CRM, los datos se precargan automáticamente
2. **Manual:** Ingresás el cliente, origen, destino, tipo de transporte y detalles de la carga

**¿Qué estados tiene un requerimiento?**
- **Pendiente:** Creado, esperando asignación de flota
- **Asignado:** Se le asignó una nave o vehículo
- **Activo:** El servicio está en curso
- **En Progreso:** Operación ejecutándose
- **Completado:** Servicio finalizado exitosamente
- **Cancelado:** Requerimiento cancelado

**¿Cómo asigno una nave o vehículo a un requerimiento?**
Desde el requerimiento, haz clic en *Asignar*. El sistema muestra las naves o vehículos disponibles. Selecciona el que corresponda y confirma. Una vez asignado, se genera automáticamente un **Servicio** para ese requerimiento.

**¿Puedo ver la ruta del requerimiento en el mapa?**
Sí. Desde el detalle del requerimiento puedes visualizar el origen y destino en un mapa, ya sea usando rutas predefinidas o direcciones específicas.

---

### Cotizaciones (Provenientes del CRM)
Esta sección muestra las cotizaciones aprobadas que llegan desde GOxT CRM. Desde aquí se pueden convertir en requerimientos operativos.

**¿Qué puedo hacer?**
- Ver todas las cotizaciones recibidas desde el CRM con sus servicios y montos
- Revisar el detalle de cada cotización: cliente, organización, validez, servicios y precios
- Crear un requerimiento directamente desde un servicio de la cotización
- Enviar cotizaciones por email
- Eliminar cotizaciones

**¿Cómo convierto una cotización en un requerimiento?**
Abre la cotización, busca el servicio correspondiente y haz clic en *Crear requerimiento*. Los datos del cliente y la nave preseleccionada se cargan automáticamente.

---

## TRIPULANTES

Gestión centralizada de los conductores, capitanes, marineros y cualquier otro miembro de la tripulación que opera los vehículos y embarcaciones del workspace.

**¿Qué puedo hacer en Tripulantes?**
- Ver el listado completo de tripulantes
- Agregar nuevos tripulantes con sus datos (nombre, RUT, tipo, documentación)
- Buscar por nombre, RUT o tipo de tripulante
- Gestionar el estado activo/inactivo de cada uno
- Asignar tripulantes a servicios y flotas

**¿Cómo agrego un tripulante?**
Ve a *Tripulantes*, haz clic en "Nuevo tripulante" e ingresa los datos requeridos: nombre, RUT, tipo (capitán, marinero, operario, conductor, etc.) y documentación correspondiente.

---

## FLOTAS

### Transporte Marítimo
Gestión de todas las embarcaciones y naves del workspace.

**¿Qué puedo hacer?**
- Ver el listado de naves con su estado (disponible / en servicio)
- Agregar nuevas embarcaciones con información técnica (nombre, tipo de nave, imagen)
- Asociar cada nave a un proveedor de transporte
- Ver la ficha técnica completa de cada nave: dimensiones, capacidad, tipo de propulsión
- Consultar disponibilidad antes de asignar a un requerimiento

**¿Cómo sé si una nave está disponible?**
Desde la lista de flotas marítimas puedes ver el estado de cada nave en tiempo real. Al asignar una nave a un requerimiento, el sistema filtra automáticamente las disponibles.

### Transporte Terrestre
Gestión de la flota de vehículos terrestres (camiones, tractos, etc.) del workspace.

**¿Qué puedo hacer?**
- Administrar el listado de vehículos con su estado operativo
- Registrar información del vehículo, tipo y documentación
- Controlar disponibilidad para asignación a requerimientos

---

## SERVICIOS

Un servicio se crea automáticamente cuando se asigna una nave o vehículo a un requerimiento. Representa la ejecución operativa del transporte.

### Bitácora
Registro cronológico de todos los eventos ocurridos durante un servicio. Permite tener trazabilidad completa de lo que sucedió durante la operación.

**¿Qué puedo ver en la Bitácora?**
- Historial de eventos del servicio (inicio, paradas, incidentes, finalización)
- Registro de cambios de estado
- Documentos asociados al servicio

### Telemetría
Sistema de seguimiento GPS en tiempo real de los vehículos y embarcaciones en servicio.

**¿Qué puedo ver en Telemetría?**
- Ubicación en tiempo real de la flota
- Velocidad y trayecto actual
- Alertas de geocercas (zonas definidas de entrada/salida)
- Historial de recorridos

### Detalle del Servicio
Cada servicio tiene su propia vista de detalle con toda la información consolidada:
- Datos del transporte asignado y la carga
- Bitácora de eventos
- Documentos del servicio
- Estado actual

---

## FINANZAS

### Órdenes de Compra
Las órdenes de compra se generan hacia los **proveedores de transporte** por los servicios ejecutados. Gestionan el pago a quienes realizaron el transporte.

**¿Qué puedo hacer?**
- Crear órdenes de compra con datos del proveedor y monto
- Registrar la factura del proveedor (número, fechas)
- Subir el documento PDF de la factura
- Aprobar órdenes de compra
- Enviar por email al proveedor
- Descargar en PDF o Excel
- Ver el historial de cambios de cada orden
- Eliminar órdenes

**¿Cómo creo una orden de compra?**
Ve a *Finanzas → Órdenes de Compra* y haz clic en "Nueva orden de compra". Ingresa el nombre del proveedor, su RUT/NIT y el monto total. Luego puedes adjuntar la factura del proveedor y aprobarla.

**¿Qué estados tiene una orden de compra?**
- **Pendiente:** Creada, en espera de revisión
- **Aprobada:** Validada y aprobada para pago
- **Cancelada:** Anulada

---

### Prefacturas
Las prefacturas se generan hacia los **clientes (Generadores de Carga)** por los servicios prestados. Gestionan el cobro por los servicios de transporte realizados.

**¿Qué puedo hacer?**
- Crear prefacturas asociadas a un cliente y sus servicios
- Asignar el número de orden de compra del cliente
- Subir documentos de OC y factura definitiva
- Registrar el pago recibido (monto y fecha)
- Aprobar prefacturas
- Enviar por email al cliente
- Descargar en PDF o Excel
- Ver historial de cambios
- Eliminar prefacturas

**¿Cuál es el flujo de una prefactura?**
1. Se crea la prefactura con los datos del cliente y el monto → estado **Pendiente**
2. Se adjunta la orden de compra del cliente
3. Se ingresa la factura definitiva → estado **Facturada**
4. Se registra el pago recibido → estado **Pagada**
5. Se aprueba → estado **Aprobada**

**¿Cómo descargo una prefactura en PDF?**
Desde el listado o el detalle de la prefactura, haz clic en el botón de descarga. El documento se genera automáticamente con todos los datos registrados.

---

## CONFIGURACIÓN

### General
Configuración básica del workspace: nombre, logo e información de la empresa.

### Usuarios e Invitaciones
Gestión de los usuarios con acceso al workspace de Cargo.

**¿Cómo invito a un usuario?**
Ve a *Configuración → Usuarios* y haz clic en "Invitar usuario". Selecciona el perfil correspondiente (Administrador, Operador, Generador de Carga, Proveedor de Transporte o Destinatario), ingresa el email y envía la invitación. El usuario recibirá un correo para unirse al workspace.

**¿Qué perfiles puedo asignar?**
- **Administrador:** Acceso completo
- **Operador:** Acceso operativo sin finanzas ni configuración
- **Generador de Carga:** Asociado a una empresa cliente
- **Proveedor de Transporte:** Asociado a una empresa proveedora
- **Destinatario:** Asociado a una empresa destinataria

### Ubicaciones y Direcciones
Gestión de direcciones y puntos de origen/destino predefinidos para el workspace. Al configurarlas aquí, quedan disponibles al crear requerimientos y servicios.

**¿Cómo agrego una dirección?**
Ve a *Configuración → Ubicaciones*, haz clic en "Nueva dirección" e ingresa el nombre o alias, la dirección completa y las coordenadas GPS si corresponde.

### Historial de Usuarios
Registro de auditoría de todas las acciones realizadas por los usuarios del workspace.

### API
Para administradores, permite gestionar las claves de API para integrar GOxT Cargo con sistemas externos.

---

## Flujo completo de una operación en GOxT Cargo

```
1. REQUERIMIENTO
   El cliente solicita un servicio de transporte
   → Se crea el requerimiento (manual o desde cotización CRM)

2. ASIGNACIÓN
   Se asigna una nave o vehículo disponible
   → El sistema crea automáticamente un Servicio

3. EJECUCIÓN
   El servicio está en curso
   → Se registran eventos en la Bitácora
   → Se hace seguimiento vía Telemetría GPS

4. CIERRE
   El servicio se completa
   → Se genera la Prefactura al cliente
   → Se genera la Orden de Compra al proveedor

5. FACTURACIÓN
   Se adjuntan documentos, se registran pagos
   → Se aprueban los documentos financieros
```

---

## Preguntas frecuentes — GOxT Cargo

**¿Puedo usar GOxT Cargo sin GOxT CRM?**
Sí. GOxT Cargo funciona de forma independiente. Si también usas GOxT CRM, las cotizaciones aprobadas llegan automáticamente a Cargo, pero no es obligatorio.

**¿Cómo se conecta GOxT CRM con Cargo?**
Las cotizaciones aprobadas en CRM aparecen en *Requerimientos → Cotizaciones* dentro de Cargo. Desde ahí puedes convertirlas en requerimientos operativos con un clic, sin ingresar los datos nuevamente.

**¿Puedo hacer tracking de mis vehículos en tiempo real?**
Sí. Desde *Servicios → Telemetría* puedes ver la ubicación en tiempo real de tu flota durante los servicios activos.

**¿Cómo gestiono los documentos de cada servicio?**
Desde el detalle de cada requerimiento y servicio puedes subir, descargar y gestionar todos los documentos asociados (guías de despacho, manifiestos, comprobantes, etc.).

**¿Puedo usar GOxT Cargo desde el celular?**
Sí. GOxT Cargo es una aplicación web responsiva, accesible desde cualquier dispositivo con navegador.

**¿Cómo contacto al soporte de GOxT?**
Escríbenos a kevin.collio@goxt.io o [agenda una reunión aquí](https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0fZjKM69ppQ86kVp84jN7SlLTN8aRZLme9EaO_466sFB9wff2ViH3GzFBkFDRwA9fHqihgqFaB).
