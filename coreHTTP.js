class CoreHTTP {
  constructor () {
  }

  async request (url, method, data = null) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (data) {
      config.body = JSON.stringify(data);
    }
    try {
      const response = await fetch(`${url}`, config);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log(`Error: ${error}`);
      throw error;
    }
  }

  get(url) {
    return this.request(url, 'GET');
  }
 
  post(url, data) {
    return this.request(url, 'POST', data);
  }
 
  put(url, data) {
    return this.request(url, 'PUT', data);
  }
 
  delete(url) {
    return this.request(url, 'DELETE');
  }
 
  patch(url, data) {
    return this.request(url, 'PATCH', data);
  }
}