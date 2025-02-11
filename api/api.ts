"use server";
import axios from "axios";
import { cookies } from "next/headers";

const API_BASE_URL = "http://192.168.0.148:8000/api";
export const getDocument = async (docId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/document/get/${docId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; 
  }
};

export const signin = async (data: { username: string; password: string }) => {
  const cook = await cookies();
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, data);
    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }
    cook.set("token", response.data.access);
    return response.data; 
  } catch (error) {
    console.error("Error during login:", error);
    throw error; 
  }
};

export const signUp = async (data: { username: string; password: string }) => {
  const cook = await cookies();
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, data);
    if (response.status !== 201) {
      return { success: false, message: response.data.message };
    }
    cook.set("token", response.data.access);
    return response.data; 
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};
export const signout = async () => {
  const cook = await cookies();
  
  try {
    const response = await axios.post(`${API_BASE_URL}/user/logout?refresh_token=${cook.get("token").value}`);
    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }
    cook.delete("token"); 
    return { success: true }; 
  } catch (error) {
    console.error("Error during logout:", error);
    throw error; 
  }
};




export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/get_all`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; 
  }
};
export const rolePermission = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rolepermission/get_all`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; 
  }
};
export const getCategory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category/get-category`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; 
  }
};

export const searchDocuments = async (query: string) => {
  if (!query) return [];
  try {
    const response = await axios.get(`${API_BASE_URL}/document/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching documents:", error);
    throw error;
  }
};


export const updateDocument = async (data: { id: string; title?: string; content?: string }) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/document/update-doc`,
     data 
    );
    console.log(response);
    
    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error during document update:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "An error occurred" 
    };
  }
};
export const updateCategory = async (data: { id: string; title?: string; name?: string }) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/category/update_category`,
     data 
    );
    console.log(response);
    
    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error during document update:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "An error occurred" 
    };
  }
};
export const deleteCategory = async (data: { id: string; }) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/category/delete_category/${data.id}`, 
    );
    console.log(response);
    
    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error during document update:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "An error occurred" 
    };
  }
};
export const deleteDocument = async (data: { id: string; }) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/document/delete_document/${data.id}`,
    );
    
    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error during document update:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "An error occurred" 
    };
  }
};


export const createCategory = async (data: { name: string; cate_parent?: any }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/category/create-category`, data);

    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error during category creation:", error);
    return { success: false, message: error.response?.data?.message || "An error occurred" };
  }
};

export const createDocument = async (data: { content: string; title: string; category: any }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/document/create-doc`, data);

    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error during category creation:", error);
    return { success: false, message: error.response?.data?.message || "An error occurred" };
  }
};


export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/role/get_all`);
    const rolesData = response.data;

    const roles = rolesData.map((item: { id: string; role: string }) => ({
      id: item.id,
      role: item.role,
    }));

    return roles; 
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};
export const getPermissionsNotInRole = async (id:string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rolepermission/get_permissions_not_in_role/${id}`);
    const rolesData = response.data;

    const roles = rolesData.map((item: { id: string; permission: string }) => ({
      id: item.id,
      permission: item.permission,
    }));

    return roles; 
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const getPermissionsInRole = async (id:string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rolepermission/get_permissions_in_role/${id}`);
    const rolesData = response.data;

    const roles = rolesData.map((item: { id: string; permission: string }) => ({
      id: item.id,
      permission: item.permission,
    }));

    return roles; 
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};


export const assignPermissionToRole = async (data: { role_id: string; permission_id: string[] }) => {
  console.log(data);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/rolepermission/create_rolesperms`, data);
    console.log(response);
    
    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }
    return response.data;
  } catch (error) {
    console.error("Error during permission assignment:", error);
    throw error;
  }
};


export const deletePermission = async (data: { id: string; }) => {
  console.log(data.id);
  
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/rolepermission/delete_rolesoerms/${data.id}`, 
    );
    
    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error during document update:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "An error occurred" 
    };
  }
};