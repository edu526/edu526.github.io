#!/usr/bin/env python3
"""
Generador de iconos PWA simple
Crea iconos básicos con emojis/texto para cada aplicación
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False
    print("⚠️  Pillow no está instalado. Instalando...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont
    print("✅ Pillow instalado correctamente")

import os

def create_icon(text, bg_color, text_color, size, output_path):
    """Crea un icono simple con texto/emoji"""
    img = Image.new('RGB', (size, size), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Intentar usar una fuente del sistema, si no usar la predeterminada
    try:
        # Para Windows
        font_size = int(size * 0.5)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            # Para Linux/Mac
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", int(size * 0.5))
        except:
            # Fuente predeterminada
            font = ImageFont.load_default()

    # Centrar el texto
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (size - text_width) // 2
    y = (size - text_height) // 2

    draw.text((x, y), text, fill=text_color, font=font)

    # Crear directorio si no existe
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    img.save(output_path, 'PNG')
    print(f"✅ Creado: {output_path}")

def generate_icons():
    """Genera todos los iconos necesarios para las PWAs"""
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]

    # Configuración de apps
    apps = [
        {
            'name': 'Principal',
            'text': 'E',
            'bg_color': '#3498db',
            'text_color': '#ffffff',
            'path': 'icons'
        },
        {
            'name': 'Calculadora',
            'text': '💰',
            'bg_color': '#3498db',
            'text_color': '#ffffff',
            'path': 'calculadora-sublimacion/icons'
        },
        {
            'name': 'Piano',
            'text': '🎹',
            'bg_color': '#6366f1',
            'text_color': '#ffffff',
            'path': 'piano/icons'
        }
    ]

    for app in apps:
        print(f"\n📱 Generando iconos para: {app['name']}")
        for size in sizes:
            output_path = f"{app['path']}/icon-{size}.png"
            create_icon(
                text=app['text'],
                bg_color=app['bg_color'],
                text_color=app['text_color'],
                size=size,
                output_path=output_path
            )

    print("\n✨ ¡Todos los iconos han sido generados!")

if __name__ == "__main__":
    print("🎨 Generador de Iconos PWA")
    print("=" * 40)
    generate_icons()
