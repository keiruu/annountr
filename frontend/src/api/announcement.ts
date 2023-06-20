import axios from 'axios'

export const addAnnouncement = async (data : any, id : string) => {
  try {
    const response = await axios.post(`http://localhost:4000/api/v1/announcement/${id}/create`, {
      title: data.title,
      desc: data.desc,
      deadline: data.deadline,
      date: data.date
    });

    return response
  } catch (error) {
    console.error(error);
  }
};

export const updateAnnouncement = async (data : any, id : string) => {
  try {
    const response = await axios.put(`http://localhost:4000/api/v1/announcement/${id}/update`, {
      id: data.id,
      title: data.title,
      desc: data.desc,
    });

    return response
  } catch (error) {
    console.error(error);
  }
};

export const getAnnouncements = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/v1/announcement/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const deleteAnnouncement = async (id: string, announcementId: string) => {
  try {
    const response = await axios.delete(`http://localhost:4000/api/v1/announcement/${id}/delete`, {
      data: {
        id: announcementId
      }
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

