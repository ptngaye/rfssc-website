#!/usr/bin/env python3
"""
Background Remover CLI Tool
==========================

A command-line tool to remove backgrounds from all images in a folder
and output the results as a ZIP file with transparent backgrounds.

Requirements:
    pip install rembg pillow opencv-python tqdm

Usage:
    python bg_remover.py --input /path/to/images --output results.zip
    python bg_remover.py -i ./photos -o clean_images.zip
    
Features:
    - Processes JPG, PNG, JPEG, WebP, BMP images
    - Uses AI-powered background removal (rembg)
    - Batch processing with progress bars
    - Outputs high-quality PNG files with transparency
    - Creates organized ZIP archive
"""

import os
import sys
import argparse
import zipfile
from pathlib import Path
from typing import List, Optional
import tempfile
import shutil

try:
    from rembg import remove, new_session
    from PIL import Image, ImageEnhance
    import cv2
    import numpy as np
    from tqdm import tqdm
except ImportError as e:
    print(f"❌ Missing required packages. Please install with:")
    print("pip install rembg pillow opencv-python tqdm")
    print(f"Error: {e}")
    sys.exit(1)


class BackgroundRemover:
    """AI-powered background removal tool"""
    
    SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}
    
    def __init__(self, model: str = 'u2net'):
        """Initialize with specified AI model"""
        self.model_name = model
        self.session = None
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize the AI model for background removal"""
        try:
            print(f"🔧 Initializing {self.model_name} model...")
            self.session = new_session(self.model_name)
            print("✅ Model loaded successfully!")
        except Exception as e:
            print(f"❌ Failed to load model: {e}")
            sys.exit(1)
    
    def find_images(self, folder_path: Path) -> List[Path]:
        """Find all supported image files in the folder"""
        images = []
        for file_path in folder_path.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in self.SUPPORTED_FORMATS:
                images.append(file_path)
        return sorted(images)
    
    def remove_background(self, input_path: Path) -> Optional[Image.Image]:
        """Remove background from a single image"""
        try:
            # Read input image
            with open(input_path, 'rb') as f:
                input_data = f.read()
            
            # Remove background using AI
            output_data = remove(input_data, session=self.session)
            
            # Convert to PIL Image
            from io import BytesIO
            output_image = Image.open(BytesIO(output_data)).convert("RGBA")
            
            # Optional: Enhance edges for better quality
            output_image = self._enhance_edges(output_image)
            
            return output_image
            
        except Exception as e:
            print(f"⚠️  Failed to process {input_path.name}: {e}")
            return None
    
    def _enhance_edges(self, image: Image.Image) -> Image.Image:
        """Enhance edge quality of the processed image"""
        try:
            # Convert to numpy array
            img_array = np.array(image)
            
            # Separate alpha channel
            rgb = img_array[:, :, :3]
            alpha = img_array[:, :, 3]
            
            # Apply slight smoothing to alpha channel to reduce jaggedness
            alpha_smoothed = cv2.GaussianBlur(alpha, (3, 3), 0.5)
            
            # Combine back
            enhanced = np.dstack((rgb, alpha_smoothed))
            
            return Image.fromarray(enhanced, 'RGBA')
            
        except Exception:
            # If enhancement fails, return original
            return image
    
    def process_folder(self, input_folder: Path, output_zip: Path, 
                      quality: str = 'high') -> bool:
        """Process all images in folder and create ZIP output"""
        
        # Validate input folder
        if not input_folder.exists() or not input_folder.is_dir():
            print(f"❌ Input folder does not exist: {input_folder}")
            return False
        
        # Find all images
        image_files = self.find_images(input_folder)
        if not image_files:
            print(f"❌ No supported images found in {input_folder}")
            print(f"Supported formats: {', '.join(self.SUPPORTED_FORMATS)}")
            return False
        
        print(f"📁 Found {len(image_files)} images to process")
        
        # Create temporary directory for processed images
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            processed_files = []
            
            # Process each image with progress bar
            with tqdm(image_files, desc="🎨 Removing backgrounds", 
                     unit="img", colour="green") as pbar:
                
                for img_path in pbar:
                    pbar.set_description(f"🎨 Processing {img_path.name}")
                    
                    # Remove background
                    result_image = self.remove_background(img_path)
                    
                    if result_image:
                        # Save processed image
                        output_filename = f"{img_path.stem}_no_bg.png"
                        output_path = temp_path / output_filename
                        
                        # Save with appropriate quality settings
                        save_kwargs = {
                            'format': 'PNG',
                            'optimize': quality == 'optimized',
                        }
                        
                        if quality == 'high':
                            save_kwargs['compress_level'] = 1
                        elif quality == 'optimized':
                            save_kwargs['compress_level'] = 6
                        
                        result_image.save(output_path, **save_kwargs)
                        processed_files.append((output_path, output_filename))
                        
                        pbar.set_postfix({"✅ Processed": len(processed_files)})
            
            if not processed_files:
                print("❌ No images were successfully processed")
                return False
            
            # Create ZIP file
            print(f"📦 Creating ZIP archive: {output_zip}")
            
            with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED, 
                               compresslevel=6) as zipf:
                
                # Add processed images to ZIP
                for file_path, archive_name in tqdm(processed_files, 
                                                   desc="📦 Creating ZIP", 
                                                   colour="blue"):
                    zipf.write(file_path, archive_name)
                
                # Add a README file
                readme_content = self._generate_readme(len(processed_files))
                zipf.writestr("README.txt", readme_content)
            
            print(f"✅ Successfully processed {len(processed_files)} images")
            print(f"📁 Output saved to: {output_zip}")
            print(f"📊 ZIP file size: {self._format_size(output_zip.stat().st_size)}")
            
            return True
    
    def _generate_readme(self, count: int) -> str:
        """Generate README content for the ZIP file"""
        return f"""Background Removal Results
========================

📊 Summary:
- Total images processed: {count}
- AI Model used: {self.model_name}
- Output format: PNG with transparency
- Generated on: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

📁 Files:
All images have been processed to remove backgrounds and saved as PNG files
with transparent backgrounds. The naming convention is:
original_filename_no_bg.png

🎨 Usage Tips:
- These PNG files can be used on any background
- Perfect for presentations, websites, and graphic design
- Maintain high quality and transparency
- Can be further edited in image editing software

Generated by Background Remover CLI Tool
"""
    
    def _format_size(self, size_bytes: int) -> str:
        """Format file size in human readable format"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.1f} TB"


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description="🎨 AI-Powered Background Remover CLI Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python bg_remover.py -i ./photos -o results.zip
    python bg_remover.py --input /path/to/images --output clean_images.zip --model u2netp --quality high
    
Supported image formats: JPG, JPEG, PNG, WebP, BMP
        """
    )
    
    parser.add_argument('-i', '--input', type=str, required=True,
                       help='Input folder containing images')
    
    parser.add_argument('-o', '--output', type=str, required=True,
                       help='Output ZIP file path')
    
    parser.add_argument('--model', type=str, default='u2net',
                       choices=['u2net', 'u2netp', 'u2net_human_seg', 'silueta'],
                       help='AI model to use (default: u2net)')
    
    parser.add_argument('--quality', type=str, default='high',
                       choices=['high', 'optimized'],
                       help='Output quality (default: high)')
    
    parser.add_argument('--version', action='version', version='1.0.0')
    
    args = parser.parse_args()
    
    # Convert paths
    input_folder = Path(args.input).resolve()
    output_zip = Path(args.output).resolve()
    
    # Ensure output directory exists
    output_zip.parent.mkdir(parents=True, exist_ok=True)
    
    print("🎨 Background Remover CLI Tool v1.0.0")
    print("=" * 50)
    print(f"📁 Input folder: {input_folder}")
    print(f"📦 Output ZIP: {output_zip}")
    print(f"🤖 AI Model: {args.model}")
    print(f"⚙️  Quality: {args.quality}")
    print("=" * 50)
    
    # Initialize and run
    try:
        remover = BackgroundRemover(model=args.model)
        success = remover.process_folder(input_folder, output_zip, args.quality)
        
        if success:
            print("\n🎉 Background removal completed successfully!")
            print(f"📁 Your results are ready: {output_zip}")
            sys.exit(0)
        else:
            print("\n❌ Background removal failed!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⚠️  Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()