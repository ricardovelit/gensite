<<<<<<< HEAD
"""
Módulo para integraciones con pasarelas de pago

Soporte actual:
- Stripe
- PayPal
"""
import os
import stripe
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment

class PaymentProcessor:
    """Clase principal para manejar pagos"""
    
    def __init__(self):
        # Configuración de Stripe
        stripe.api_key = os.getenv('STRIPE_API_KEY')
        
        # Configuración de PayPal
        paypal_client_id = os.getenv('PAYPAL_CLIENT_ID')
        paypal_secret = os.getenv('PAYPAL_SECRET')
        self.paypal_env = SandboxEnvironment(client_id=paypal_client_id, client_secret=paypal_secret)
        self.paypal_client = PayPalHttpClient(self.paypal_env)
    
    def create_stripe_payment(self, amount: float, currency: str, description: str) -> dict:
        """Crea un pago con Stripe"""
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Stripe usa centavos
                currency=currency.lower(),
                description=description
            )
            return {
                'client_secret': intent.client_secret,
                'payment_id': intent.id
            }
        except Exception as e:
            return {'error': str(e)}
    
    def create_paypal_order(self, amount: float, currency: str) -> dict:
        """Crea una orden de pago con PayPal"""
        from paypalcheckoutsdk.orders import OrdersCreateRequest
        
        request = OrdersCreateRequest()
        request.prefer('return=representation')
        request.request_body({
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": currency.upper(),
                    "value": f"{amount:.2f}"
                }
            }]
        })
        
        try:
            response = self.paypal_client.execute(request)
            return {
                'order_id': response.result.id,
                'approval_url': next(link.href for link in response.result.links if link.rel == 'approve')
            }
        except Exception as e:
            return {'error': str(e)}
    
    def capture_paypal_payment(self, order_id: str) -> dict:
        """Captura un pago de PayPal después de la aprobación"""
        from paypalcheckoutsdk.orders import OrdersCaptureRequest
        
        request = OrdersCaptureRequest(order_id)
        try:
            response = self.paypal_client.execute(request)
            return {
                'capture_id': response.result.id,
                'status': response.result.status
            }
        except Exception as e:
=======
"""
Módulo para integraciones con pasarelas de pago

Soporte actual:
- Stripe
- PayPal
"""
import os
import stripe
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment

class PaymentProcessor:
    """Clase principal para manejar pagos"""
    
    def __init__(self):
        # Configuración de Stripe
        stripe.api_key = os.getenv('STRIPE_API_KEY')
        
        # Configuración de PayPal
        paypal_client_id = os.getenv('PAYPAL_CLIENT_ID')
        paypal_secret = os.getenv('PAYPAL_SECRET')
        self.paypal_env = SandboxEnvironment(client_id=paypal_client_id, client_secret=paypal_secret)
        self.paypal_client = PayPalHttpClient(self.paypal_env)
    
    def create_stripe_payment(self, amount: float, currency: str, description: str) -> dict:
        """Crea un pago con Stripe"""
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Stripe usa centavos
                currency=currency.lower(),
                description=description
            )
            return {
                'client_secret': intent.client_secret,
                'payment_id': intent.id
            }
        except Exception as e:
            return {'error': str(e)}
    
    def create_paypal_order(self, amount: float, currency: str) -> dict:
        """Crea una orden de pago con PayPal"""
        from paypalcheckoutsdk.orders import OrdersCreateRequest
        
        request = OrdersCreateRequest()
        request.prefer('return=representation')
        request.request_body({
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": currency.upper(),
                    "value": f"{amount:.2f}"
                }
            }]
        })
        
        try:
            response = self.paypal_client.execute(request)
            return {
                'order_id': response.result.id,
                'approval_url': next(link.href for link in response.result.links if link.rel == 'approve')
            }
        except Exception as e:
            return {'error': str(e)}
    
    def capture_paypal_payment(self, order_id: str) -> dict:
        """Captura un pago de PayPal después de la aprobación"""
        from paypalcheckoutsdk.orders import OrdersCaptureRequest
        
        request = OrdersCaptureRequest(order_id)
        try:
            response = self.paypal_client.execute(request)
            return {
                'capture_id': response.result.id,
                'status': response.result.status
            }
        except Exception as e:
>>>>>>> 90d22681d2c30acb385206e300b3ba63575d2b65
            return {'error': str(e)}