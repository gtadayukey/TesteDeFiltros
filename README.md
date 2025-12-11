# Image Filter API (Flask + OpenCV)

Uma API modular para aplicar filtros em imagens usando OpenCV, com suporte a React no frontend.

---

## 🚀 Instalação

utilizando o pyproject.toml

```bash
pip install .
```

executar o servidor
```bash
python main.py
```

servidor sobre em
```arduino
http://localhost:5000
```

## 🧪 Endpoint principal
`POST /apply_filter/<filter_name>`
Body JSON:
```json
{
  "image": "<base64>",
  "kernel_size": 5
}
```

## 📁 Estrutura do Projeto
```css
backend/
  app/
    filters/
    utils/
    routes.py
    __init__.py
  main.py
  pyproject.toml
  README.md
```

## 📚 Filtros disponíveis
- mean_blur
- gaussian_blur
- median_blur
- canny
- sobel

## 🛠️ Tecnologia usada
- Python
- Flask
- OpenCV
- NumPy
- CORS
