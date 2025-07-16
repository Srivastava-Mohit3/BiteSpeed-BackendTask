import connectDB from "../db.js";

export const identifyContact = async (req, res) => {
  try {
    let { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ error: "email or phoneNumber required" });
    }

    const safeEmail = email || null;
    const safePhone = phoneNumber ? phoneNumber.toString() : null;

    const { rows: matchedContacts } = await connectDB.query(
      `SELECT * FROM Contact WHERE email = $1 OR phoneNumber = $2`,
      [safeEmail, safePhone]
    );

    let allContacts = [...matchedContacts];
    let primaryContact = null;

    if (allContacts.length > 0) {
      primaryContact = allContacts.find((c) => c.linkprecedence === "primary");

      if (!primaryContact) {
        primaryContact = allContacts.reduce((oldest, c) =>
          new Date(c.createdat) < new Date(oldest.createdat) ? c : oldest
        );
      }

      const { rows: secondaryContacts } = await connectDB.query(
        `SELECT * FROM Contact WHERE linkedId = $1`,
        [primaryContact.id]
      );

      allContacts = [primaryContact, ...secondaryContacts];

      const emailExists = allContacts.some((c) => c.email === safeEmail);
      const phoneExists = allContacts.some((c) => c.phonenumber === safePhone);

      if (!emailExists || !phoneExists) {
        const { rows: newContact } = await connectDB.query(
          `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence)
           VALUES ($1, $2, $3, 'secondary') RETURNING *`,
          [safeEmail, safePhone, primaryContact.id]
        );
        allContacts.push(newContact[0]);
      }
    } else {
      const { rows: newContact } = await connectDB.query(
        `INSERT INTO Contact (email, phoneNumber, linkPrecedence)
         VALUES ($1, $2, 'primary') RETURNING *`,
        [safeEmail, safePhone]
      );
      primaryContact = newContact[0];
      allContacts = [primaryContact];
    }

    const emails = [
      ...new Set(allContacts.map((c) => c.email).filter(Boolean)),
    ];
    const phoneNumbers = [
      ...new Set(allContacts.map((c) => c.phonenumber).filter(Boolean)),
    ];
    const secondaryContactIds = allContacts
      .filter((c) => c.linkprecedence === "secondary")
      .map((c) => c.id);

    return res.status(200).json({
      contact: {
        primaryContactId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    });
  } catch (err) {
    console.error("Error in identifyContact:", err);
    res.status(500).json({ error: "Server error" });
  }
};
