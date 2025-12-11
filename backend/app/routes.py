from flask import Blueprint, request, jsonify
from .filters.registry import FILTERS, FILTERS_REQUIRING_KERNEL
from .utils.image_codec import decode_base64_to_image, encode_image_to_base64

filter_blueprint = Blueprint("filters", __name__)

@filter_blueprint.route("/apply_filter/<filter_name>", methods=["POST"])
def apply_filter(filter_name):
    data = request.json or {}
    encoded_image = data.get("image")

    if not encoded_image:
        return jsonify({"error": "Nenhuma imagem fornecida"}), 400

    img = decode_base64_to_image(encoded_image)
    if img is None:
        return jsonify({"error": "Falha ao decodificar imagem"}), 400

    if filter_name not in FILTERS:
        return jsonify({"error": f'Filtro "{filter_name}" não encontrado'}), 404

    func = FILTERS[filter_name]

    if filter_name in FILTERS_REQUIRING_KERNEL:
        k = int(data.get("kernel_size", 5))
        k = k if k % 2 == 1 else k + 1
        result = func(img, k)
    else:
        result = func(img)

    b64 = encode_image_to_base64(result)
    return jsonify({"filtered_image": b64})