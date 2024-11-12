const ProgramType = require("../models/programtype");

const getTypeByID = async (req, res) => {
    const id = req.params.id;
    try {
        const type = await ProgramType.getTypeByID(id);
        if (type.length === 0) {
        return res.status(404).send("type not found");
        }
        res.json(type);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving type");
    }
};

module.exports = {getTypeByID}