import { db } from "@/lib/prisma";

async function getAddress(address_id: string, userId: string) {
  return await db.address.findUnique({
    where: {
      id:address_id,
      userId,
    },
  });
}

async function getAllAddresses(userId: string) {
  const result = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      addresses: {
        where: {
          is_deleted: false,
        },
      },
    },
  });
  return result?.addresses;
}

async function createAddress(data: any) {
  return await db.address.create({
    data,
  });
}

async function setDefaultFalseAddress(userId: string) {
  return await db.address.updateMany({
    data: {
      is_default: false,
    },
    where: {
      userId,
    },
  });
}

async function updateAddress(data: any, address_id: string, userId: string) {
  return await db.address.update({
    data,
    where: {
      id:address_id,
      userId,
    },
  });
}

async function deleteAddress(address_id: string, userId: string) {
  return await db.address.delete({
    where: {
      id:address_id,
      userId,
    },
  });
}

async function checkAddressPresentInOrder(addressId: string, userId: string) {
  return await db.order.findFirst({
    where: {
      addressId,
      userId,
    },
  });
}

async function markAsDeletedAddress(userId: string, address_id: string) {
  return await db.address.update({
    data: {
      is_deleted: true,
    },
    where: {
      userId,
      id:address_id,
    },
  });
}

export {
  getAddress,
  getAllAddresses,
  createAddress,
  setDefaultFalseAddress,
  updateAddress,
  deleteAddress,
  checkAddressPresentInOrder,
  markAsDeletedAddress,
};
