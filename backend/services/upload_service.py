import os
import aiofiles
from fastapi import UploadFile, HTTPException
from config.settings import settings
from pathlib import Path
import uuid
from PIL import Image

class UploadService:
    @staticmethod
    async def save_file(file: UploadFile, subfolder: str = "reports") -> str:
        """Save uploaded file and return file path"""
        # Validate file size
        file_size = 0
        chunk_size = 1024 * 1024  # 1MB chunks
        
        # Create upload directory if not exists
        upload_path = Path(settings.UPLOAD_DIR) / subfolder
        upload_path.mkdir(parents=True, exist_ok=True)
        
        # Validate file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file_ext} not allowed. Allowed types: {settings.ALLOWED_EXTENSIONS}"
            )
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = upload_path / unique_filename
        
        # Save file
        try:
            async with aiofiles.open(file_path, 'wb') as f:
                while chunk := await file.read(chunk_size):
                    file_size += len(chunk)
                    
                    # Check size limit
                    if file_size > settings.MAX_FILE_SIZE:
                        # Remove partial file
                        await f.close()
                        os.remove(file_path)
                        raise HTTPException(
                            status_code=400,
                            detail=f"File too large. Max size: {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
                        )
                    
                    await f.write(chunk)
            
            return str(file_path)
        
        except Exception as e:
            # Clean up on error
            if file_path.exists():
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    @staticmethod
    async def save_profile_picture(file: UploadFile, employee_id: str) -> str:
        """Save profile picture with image processing"""
        # Validate it's an image
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in {".png", ".jpg", ".jpeg"}:
            raise HTTPException(status_code=400, detail="Only image files allowed for profile pictures")
        
        # Save original file
        file_path = await UploadService.save_file(file, "profiles")
        
        # Resize image to max 500x500
        try:
            with Image.open(file_path) as img:
                img.thumbnail((500, 500), Image.Resampling.LANCZOS)
                img.save(file_path, optimize=True, quality=85)
        except Exception as e:
            print(f"Image processing error: {e}")
        
        return file_path
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """Delete a file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            print(f"Failed to delete file: {e}")
            return False
    
    @staticmethod
    async def save_multiple_files(files: list[UploadFile], subfolder: str = "reports") -> list[str]:
        """Save multiple files"""
        saved_paths = []
        
        for file in files:
            try:
                path = await UploadService.save_file(file, subfolder)
                saved_paths.append(path)
            except Exception as e:
                # Clean up already saved files on error
                for path in saved_paths:
                    UploadService.delete_file(path)
                raise e
        
        return saved_paths