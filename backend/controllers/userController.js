import { sql } from '../config/db.js'


export const createUser = async (req, res) => {
  const { name, email, photo_url, role } = req.body;


  try {

    const existingUser = await sql`
    SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(200).json({ success: true, message: "User already exists", data: existingUser[0] });
    }

    const newUser = await sql`
      INSERT INTO users (name, email, photo_url, role)
      VALUES(${name}, ${email}, ${photo_url || 'https://via.placeholder.com/150'}, ${role || 'user'})
      RETURNING *
    `;

    const user = { ...newUser[0], id: newUser[0].user_id };

    console.log("new user added", user);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export const getAllUsers = async (req, res) => {
  try {
    const users = await sql`
      SELECT * FROM users
      ORDER BY created_at DESC
    `;
    // Map user_id to id for each user
    const mappedUsers = users.map(user => ({ ...user, id: user.user_id }));
    res.status(200).json({ success: true, data: mappedUsers });

  } catch (error) {
    console.log("Error fetching users", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await sql`
    SELECT * FROM users WHERE user_id=${id}
    `;
    if (user.length > 0) {
      user[0].id = user[0].user_id;
      res.status(200).json({ success: true, data: user[0] })
    } else {
      res.status(404).json({ success: false, message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await sql`
      SELECT user_id as id, name, email, photo_url , role, address, created_at 
      FROM users 
      WHERE email = ${email}
    `;

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user[0]
    });

  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message
    });
  }
};


export const DeleteUser = async (req, res) => {

  const { id } = req.params;
  try {
    const deleteUser = await sql`
DELETE FROM users WHERE user_id=${id}
RETURNING *
`;

    console.log("deleteUser", deleteUser)
    if (deleteUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    res.status(200).json({ success: true, data: deleteUser[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}



export const updateUser = async (req, res) => {

  const { id } = req.params;
  const { name, email, photo_url, role } = req.body;

  try {
    const currentUserResult = await sql`SELECT * FROM users WHERE user_id = ${id}`;
    if (currentUserResult.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const currentUser = currentUserResult[0];

    const updatedUserData = {
      name: name !== undefined ? name : currentUser.name,
      email: email !== undefined ? email : currentUser.email,
      photo_url: photo_url !== undefined ? photo_url : currentUser.photo_url,
      role: role !== undefined ? role : currentUser.role
    };

    const updateUser = await sql`
    UPDATE users
    SET name=${updatedUserData.name}, email=${updatedUserData.email}, photo_url=${updatedUserData.photo_url}, role=${updatedUserData.role}
    WHERE user_id=${id}
    RETURNING *
    `;

    if (updateUser.length > 0) {
      updateUser[0].id = updateUser[0].user_id;
    }

    res.status(200).json({ success: true, data: updateUser[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  try {
    const updatedUser = await sql`
      UPDATE users
      SET address = ${address}
      WHERE user_id = ${id}
      RETURNING *
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: updatedUser[0] });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};