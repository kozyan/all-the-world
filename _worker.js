export default {
  async fetch(request, env) {
    // Extract the 'host' header from the request
    const hostHeader = request.headers.get('host');
    
    // Create a new URL object from the request URL
    let url = new URL(request.url);
    
    // Set the hostname to 'maiyao.maiyao.gq'
    url.hostname = 'maiyao.maiyao.gq';
    
    // Create a new request with the modified URL
    const modifiedRequest = new Request(url, request);
    
    // Fetch the response from the modified request
    const response = await fetch(modifiedRequest);
    
    // Get the content-type header from the response
    const contentType = response.headers.get('content-type') || '';
    
    // Check if the response is text-based (html, javascript, or css)
    if (
      contentType.includes('text/html') ||
      contentType.includes('text/javascript') ||
      contentType.includes('text/css')
    ) {
      // Get the response body as text
      let body = await response.text();
      
      // Replace specific domain strings in the response body
      body = body
        .replace(/maiyao\.maiyao\.gq/g, hostHeader)
        .replace(/host=maiyao.maiyao.gq/g, `host=${hostHeader}`)
        .replace(/sni=maiyao.maiyao.gq/g, `sni=${hostHeader}`)
        .replace(/@maiyao\.maiyao\.gq/g, `@${hostHeader}`);
      
      // Return a new response with the modified body
      return new Response(body, {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          'Content-Length': body.length.toString(),
        },
      });
    }
    
    // Return the original response if content-type is not text-based
    return response;
  }
};
