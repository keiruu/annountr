require('dotenv').config()

const responseHandler = require('../handlers/responseHandler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AddAnnouncement = async (req: any, res: any, next: any) => {

  let payload = req.body
  const { id } = req.params

  async function addAnnouncement(id : string, title : string, desc : string, deadline : boolean, date : Date) {
    const newAnnouncement = await prisma.announcement.create({
      data: {
        user: {
          connect: {
            id: parseInt(id), // Use the actual userId value here
          },
        },
        title,
        desc,
        deadline,
        date,
        category: deadline ? 'deadline' : 'general'
      },
    });
    
    return newAnnouncement;
  }

  // Create Announcement
  try {
    const newAnnouncement = await addAnnouncement(id, payload.title, payload.desc, payload.deadline, payload.date)
    const announcement = {
      title: newAnnouncement.title,
      desc: newAnnouncement.desc,
      deadline: newAnnouncement.deadline,
      date: newAnnouncement.date
    };

    responseHandler(res, 200, 'Successful', 'Created new announcement.', announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    responseHandler(res, 'Error', 'Error creating announcement.', null);
  }

}

const GetAnnouncements = async (req: any, res: any, next: any) => {

  const { id } = req.params

  async function getAnnouncements(id : string) {
    const announcements = await prisma.announcement.findMany({
      where: {
        userId: parseInt(id),
      },
    });
  
    return announcements;
  }
  // Login User
  try {
    const announcements = await getAnnouncements(id);

    responseHandler(res, 200, 'Successful', 'Retrieved announcements', announcements);
  } catch (error) {
    console.error('Error retrieving announcements', error);
    responseHandler(res, 'Error', 'Error retrieving announcements', null);
  }
}

const DeleteAnnouncement = async (req: any, res: any, next: any) => {
  let payload = req.body

  async function deleteAnnouncement(id : string) {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });
  }

  // Delete Announcement
  try {
    await deleteAnnouncement(payload.id)

    responseHandler(res, 200, 'Successful', 'Deleted announcement.', null);
  } catch (error) {
    console.error('Error deleting announcement:', error);
    responseHandler(res, 'Error', 'Error deleting announcement.', null);
  }
}

const UpdateAnnouncement = async (req: any, res: any, next: any) => {

  let payload = req.body

  async function updateAnnouncement(id : string, title : string, desc : string) {
    const newAnnouncement = await prisma.announcement.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        desc,
      },
    });
    
    return newAnnouncement;
  }

  // Create Announcement
  try {
    const newAnnouncement = await updateAnnouncement(payload.id, payload.title, payload.desc,)
    const announcement = {
      title: newAnnouncement.title,
      desc: newAnnouncement.desc,
    };

    responseHandler(res, 200, 'Successful', 'Updated announcement.', announcement);
  } catch (error) {
    console.error('Updating announcement:', error);
    responseHandler(res, 'Error', 'Updating announcement.', null);
  }

}


module.exports = {
  AddAnnouncement,
  GetAnnouncements,
  DeleteAnnouncement,
  UpdateAnnouncement
}

export {}