const GETAPI = "https://jsonplaceholder.typicode.com/posts"


export const fetchDocument = async () => {
    try {
      const res = await fetch(GETAPI);
  
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
      }
  
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; 
    }
  };
  
  fetchDocument();