from supabase import create_client
import os
from typing import Dict, Optional, Tuple

class AuthManager:
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase = create_client(supabase_url, supabase_key)

    async def sign_up(self, email: str, password: str) -> Tuple[bool, Dict]:
        try:
            response = await self.supabase.auth.sign_up({
                "email": email,
                "password": password
            })
            return True, {"user": response.user, "session": response.session}
        except Exception as e:
            return False, {"error": str(e)}

    async def sign_in(self, email: str, password: str) -> Tuple[bool, Dict]:
        try:
            response = await self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            return True, {"user": response.user, "session": response.session}
        except Exception as e:
            return False, {"error": str(e)}

    async def sign_out(self, session_token: str) -> Tuple[bool, Dict]:
        try:
            await self.supabase.auth.sign_out(session_token)
            return True, {"message": "Successfully signed out"}
        except Exception as e:
            return False, {"error": str(e)}

    def get_user(self, session_token: str) -> Optional[Dict]:
        try:
            user = self.supabase.auth.get_user(session_token)
            return user.dict() if user else None
        except Exception:
            return None

    async def reset_password(self, email: str) -> Tuple[bool, Dict]:
        try:
            await self.supabase.auth.reset_password_for_email(email)
            return True, {"message": "Password reset email sent"}
        except Exception as e:
            return False, {"error": str(e)}

    def verify_session(self, session_token: str) -> bool:
        try:
            user = self.get_user(session_token)
            return user is not None
        except Exception:
            return False

# Middleware para proteger rutas
def require_auth(handler):
    async def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return {"error": "No authentication token provided"}, 401
        
        token = auth_header.split(' ')[1]
        auth_manager = AuthManager(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))
        
        if not auth_manager.verify_session(token):
            return {"error": "Invalid or expired token"}, 401
        
        return await handler(request, *args, **kwargs)
    
    return wrapper