## **🚀 360 Evaluation System**

Este sistema permite la evaluación de empleados mediante un modelo de feedback 360°. Está diseñado para **Admins, Managers y Employees**, cada uno con permisos específicos. La aplicación está construida con **React (Vite) en el frontend y Node.js (Express + MongoDB) en el backend**.

---

# **📌 Instalación y Uso**

```sh
# Backend
cd backend
pnpm install
pnpm run dev

# Frontend
cd frontend
pnpm install
pnpm run dev
```

---

# 📌 Estado Actual del Proyecto

✅ Backend funcional con autenticación, roles y seguridad.
✅ Frontend con Redux, rutas protegidas y manejo de tokens.
✅ Axios interceptors con refresh automático.

---

# **🛠 Backend** (Node.js, Express, MongoDB, TypeScript)

### **📌 Arquitectura y Tecnologías**

✅ **Framework:** Express.js  
✅ **Base de datos:** MongoDB + Mongoose  
✅ **Autenticación:** JWT (Access + Refresh Tokens con cookies HTTPOnly)  
✅ **Validación:** Zod  
✅ **Seguridad:** Middleware de roles (RBAC), bcrypt para hashing  
✅ **Persistencia:** MongoDB Atlas o local con Compass

### **📂 Estructura de Carpetas**

```
backend/
│── src/
│   ├── config/         # Configuración de conexión a DB
│   ├── middlewares/    # Validaciones y autenticación
│   ├── modules/        # Módulos separados (auth, employees, evaluations, feedback, reports)
│   │   ├── auth/
│   │   ├── employees/
│   │   ├── evaluations/
│   │   ├── feedback/
│   │   ├── reports/
│   ├── models/         # Modelos de MongoDB (User, Employee, Evaluation, Feedback)
│── server.ts           # Punto de entrada
```

---

### **🔑 Autenticación y Roles (Admin, Manager, Employee)**

- **Admin:** Gestiona usuarios y visualiza evaluaciones.
- **Manager:** Crea empleados, gestiona evaluaciones y envía feedback.
- **Employee:** Solo visualiza y responde evaluaciones asignadas.

### 📌 **Sistema de tokens:**

- **Access Token:** Se usa en cada request. Expira rápido.
- **Refresh Token:** Se almacena en cookies HTTPOnly y permite renovar el Access Token sin necesidad de volver a iniciar sesión.

📌 **Endpoints principales:**

```http
POST   /api/auth/register     # Registro de usuario
POST   /api/auth/login        # Inicio de sesión (JWT)
GET    /api/auth/refresh      # Refrescar token
POST   /api/auth/logout       # Cerrar sesión (elimina cookies)
```

---

### **📝 Evaluaciones y Feedback**

📌 **Evaluaciones:** Se asignan a empleados y pueden ser revisadas por managers.  
📌 **Feedback:** Managers pueden dejar comentarios en las evaluaciones.

📌 **Endpoints clave:**

```http
POST   /api/evaluations       # Crear una evaluación
GET    /api/evaluations/:id   # Obtener evaluación por ID
PUT    /api/evaluations/:id   # Actualizar evaluación
POST   /api/feedback          # Enviar feedback
```

📌 **Control de Acceso (RBAC) en middlewares:**

```ts
app.use("/api/employees", authorizeRoles("Admin", "Manager"), employeeRoutes);
app.use(
  "/api/evaluations",
  authorizeRoles("Manager", "Employee"),
  evaluationRoutes,
);
```

📌 **Seguridad adicional:**  
✅ Encriptación de contraseñas con **bcrypt**  
✅ Validación estricta con **Zod**  
✅ Protección contra **ataques CSRF/XSS** mediante headers seguros

---

# **💻 Frontend** (React + Vite, Redux Toolkit) (Bajo desarrollo)

### **📌 Tecnologías**

✅ **Framework:** React + Vite  
✅ **Estado global:** Redux Toolkit + redux-persist  
✅ **Routing:** React Router  
✅ **Autenticación:** Axios Interceptors (manejo automático de tokens)  
✅ **UI:** Tailwind CSS

---

### **🔐 Sistema de Roles en Frontend**

✅ **El Dashboard es un layout que se adapta a cada rol**  
✅ **Protección de rutas basada en roles**  
✅ **Gestión de autenticación con Redux Toolkit + Persistencia**

📌 **Rutas protegidas en `PrivateRoute.tsx`:**

📌 **Ejemplo de rutas según rol:**

```tsx
<Route path="/users" element={<RequireAuth allowedRoles={["admin"]}><UserList /></RequireAuth>} />
<Route path="/evaluations" element={<RequireAuth allowedRoles={["manager", "employee"]}><EvaluationList /></RequireAuth>} />
```

---

### **🛠 Axios Interceptor con Refresh Token**

✅ **Si un token expira, intentamos refrescar antes de cerrar sesión.**  
✅ **Si el refresh falla, limpiamos Redux y redirigimos a `/login`.**

📌 **Ejemplo de interceptor:**

```tsx
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If cookies don't exist = logout
    if (error.response?.status === 401) {
      store.dispatch(logout());
      persistStore(store).purge();

      return window.location.replace(publics.LOGIN);
    }

    // if invalid token or expired token = refresh
    originalRequest._retry = true;
    if (error.response?.status === 403 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await refreshAccessToken();
          return api.request(originalRequest); // retry original request
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // If the token is already being refreshed, wait for it to finish before retrying
      return new Promise((resolve) => {
        refreshSubscribers.push(() => resolve(api.request(originalRequest)));
      });
    }

    return Promise.reject(error);
  },
);
```
