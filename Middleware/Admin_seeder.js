import { Admin } from "../Models/admin_Mod.js";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'c39744736@gmail.com' }).lean();

    if (!existingAdmin) {
      await Admin.create({
        firstName: "Comfort",
        lastName: "Parker",
        email: "c39744736@gmail.com",
        password: "admin123", // Will be hashed by pre-save hook
        role: "admin",
        acceptedTerms: true,
        isVerified: true,
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin already exists, skipping creation');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};
