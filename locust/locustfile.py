"""
Locust Performance Testing - Shopping Ecommerce
Módulo: CRUD de Productos (Administrador)
Sumativa 3 - Pruebas No Funcionales
"""

from locust import HttpUser, task, between
import json
import random


class ProductCRUDUser(HttpUser):
    """
    Usuario simulado que ejecuta operaciones CRUD sobre el módulo de productos.
    Simula el comportamiento de un administrador gestionando productos.
    """
    
    # Tiempo de espera entre tareas: entre 1 y 3 segundos
    wait_time = between(1, 3)
    
    # Token de autenticación (simulado para admin)
    token = None
    
    def on_start(self):
        """
        Método ejecutado al inicio de cada usuario simulado.
        Simula el login de un administrador para obtener token JWT.
        """
        # Simular login de administrador
        login_payload = {
            "email": "admin@example.com",
            "password": "Admin123!"
        }
        
        response = self.client.post(
            "/auth/login",
            json=login_payload,
            headers={"Content-Type": "application/json"},
            name="POST /auth/login (setup)"
        )
        
        if response.status_code == 200 or response.status_code == 201:
            try:
                data = response.json()
                self.token = data.get("accessToken") or data.get("access_token")
            except:
                self.token = "mock-jwt-token-for-testing"
        else:
            # Token mock para continuar pruebas
            self.token = "mock-jwt-token-for-testing"
    
    def get_headers(self):
        """Retorna headers con autenticación"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }
    
    @task(4)
    def get_all_products(self):
        """
        GET /products
        Obtiene el listado completo de productos.
        Peso: 4 (operación más frecuente)
        """
        self.client.get(
            "/products",
            headers=self.get_headers(),
            name="GET /products"
        )
    
    @task(2)
    def create_product(self):
        """
        POST /products
        Crea un nuevo producto con datos aleatorios.
        Peso: 2 (operación moderadamente frecuente)
        """
        # Generar datos realistas para el producto
        product_id = random.randint(1000, 9999)
        categories = [1, 2, 3, 4, 5]  # IDs de categorías existentes
        
        payload = {
            "name": f"Producto Test {product_id}",
            "description": f"Descripción del producto de prueba {product_id}",
            "slug": f"producto-test-{product_id}",
            "price": round(random.uniform(990, 99990), 2),
            "stock": random.randint(0, 500),
            "imageUrl": f"http://localhost:9000/products/test-{product_id}.jpg",
            "categoryId": random.choice(categories),
            "isFeatured": random.choice([True, False]),
            "isOnSale": random.choice([True, False]),
            "discountPercent": random.choice([None, 10, 15, 20, 25, 30])
        }
        
        self.client.post(
            "/products",
            json=payload,
            headers=self.get_headers(),
            name="POST /products"
        )
    
    @task(2)
    def update_product(self):
        """
        PATCH /products/:id
        Actualiza un producto existente.
        Peso: 2 (operación moderadamente frecuente)
        """
        # Simular actualización de productos con IDs entre 1 y 20
        product_id = random.randint(1, 20)
        
        payload = {
            "name": f"Producto Actualizado {product_id}",
            "price": round(random.uniform(1990, 89990), 2),
            "stock": random.randint(0, 300),
            "isOnSale": random.choice([True, False]),
            "discountPercent": random.choice([None, 15, 20, 25])
        }
        
        self.client.patch(
            f"/products/{product_id}",
            json=payload,
            headers=self.get_headers(),
            name="PATCH /products/:id"
        )
    
    @task(1)
    def delete_product(self):
        """
        DELETE /products/:id
        Elimina un producto existente.
        Peso: 1 (operación menos frecuente)
        """
        # Simular eliminación de productos con IDs altos (productos de prueba)
        product_id = random.randint(100, 200)
        
        self.client.delete(
            f"/products/{product_id}",
            headers=self.get_headers(),
            name="DELETE /products/:id"
        )
    
    @task(3)
    def get_single_product(self):
        """
        GET /products/:id
        Obtiene un producto específico por ID.
        Peso: 3 (operación frecuente)
        """
        product_id = random.randint(1, 20)
        
        self.client.get(
            f"/products/{product_id}",
            headers=self.get_headers(),
            name="GET /products/:id"
        )


class AdminWorkflowUser(HttpUser):
    """
    Usuario que simula un flujo completo de administración:
    1. Listar productos
    2. Crear producto
    3. Actualizar producto
    4. Consultar producto
    5. Eliminar producto
    """
    
    wait_time = between(2, 5)
    token = None
    
    def on_start(self):
        """Login de administrador"""
        login_payload = {
            "email": "admin@example.com",
            "password": "Admin123!"
        }
        
        response = self.client.post(
            "/auth/login",
            json=login_payload,
            headers={"Content-Type": "application/json"},
            name="POST /auth/login (workflow)"
        )
        
        if response.status_code in [200, 201]:
            try:
                data = response.json()
                self.token = data.get("accessToken") or data.get("access_token")
            except:
                self.token = "mock-jwt-token-for-testing"
        else:
            self.token = "mock-jwt-token-for-testing"
    
    def get_headers(self):
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }
    
    @task
    def complete_admin_workflow(self):
        """
        Ejecuta un flujo completo de administración de productos
        """
        # 1. Listar productos
        self.client.get(
            "/products",
            headers=self.get_headers(),
            name="Workflow: GET /products"
        )
        
        # 2. Crear producto
        product_id = random.randint(5000, 9999)
        payload = {
            "name": f"Producto Workflow {product_id}",
            "description": f"Producto creado en flujo completo {product_id}",
            "slug": f"producto-workflow-{product_id}",
            "price": 15990,
            "stock": 50,
            "imageUrl": f"http://localhost:9000/products/workflow-{product_id}.jpg",
            "categoryId": 1,
            "isFeatured": False,
            "isOnSale": True,
            "discountPercent": 20
        }
        
        create_response = self.client.post(
            "/products",
            json=payload,
            headers=self.get_headers(),
            name="Workflow: POST /products"
        )
        
        # 3. Actualizar el producto creado (si fue exitoso)
        if create_response.status_code in [200, 201]:
            try:
                created_product = create_response.json()
                created_id = created_product.get("id", product_id)
            except:
                created_id = product_id
            
            update_payload = {
                "price": 12990,
                "stock": 75,
                "discountPercent": 25
            }
            
            self.client.patch(
                f"/products/{created_id}",
                json=update_payload,
                headers=self.get_headers(),
                name="Workflow: PATCH /products/:id"
            )
            
            # 4. Consultar el producto actualizado
            self.client.get(
                f"/products/{created_id}",
                headers=self.get_headers(),
                name="Workflow: GET /products/:id"
            )
            
            # 5. Eliminar el producto
            self.client.delete(
                f"/products/{created_id}",
                headers=self.get_headers(),
                name="Workflow: DELETE /products/:id"
            )
