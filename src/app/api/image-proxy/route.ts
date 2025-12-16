import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route para cargar imágenes externas evitando problemas de CORS
 * Uso: /api/image-proxy?url=ENCODED_URL
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
        // Decodificar la URL
        const decodedUrl = decodeURIComponent(imageUrl);

        // Validar que sea una URL válida de imagen
        const allowedDomains = [
            'deliverirecursos.blob.core.windows.net',
            'blob.core.windows.net',
            'res.cloudinary.com',
            'upeu.edu.pe'
        ];

        const urlObj = new URL(decodedUrl);
        const isAllowed = allowedDomains.some(domain => urlObj.hostname.includes(domain));

        if (!isAllowed) {
            return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
        }

        // Fetch la imagen
        const response = await fetch(decodedUrl, {
            headers: {
                'Accept': 'image/*',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
        }

        // Obtener el contenido y tipo
        const contentType = response.headers.get('content-type') || 'image/png';
        const buffer = await response.arrayBuffer();

        // Devolver la imagen con headers apropiados
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // Cache por 1 día
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
    }
}
