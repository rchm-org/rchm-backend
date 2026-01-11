import Admission from "../models/Admission.js";

export const createAdmission = async (req, res) => {
    try {
        const { name, email, phone, course } = req.body;

        if (!req.files?.marksheet || !req.files?.idProof || !req.files?.photo) {
            return res.status(400).json({
                success: false,
                message: "All documents are required",
            });
        }

        const admission = await Admission.create({
            name,
            email,
            phone,
            course,
            documents: {
                marksheet: req.files.marksheet[0].filename,
                idProof: req.files.idProof[0].filename,
                photo: req.files.photo[0].filename,
            },
        });

        res.status(201).json({
            success: true,
            message: "Admission application submitted",
            admission,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getAdmissions = async (req, res) => {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
};

export const updateAdmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "contacted", "closed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const updatedAdmission = await Admission.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedAdmission) {
            return res.status(404).json({
                success: false,
                message: "Admission not found",
            });
        }

        res.json({
            success: true,
            admission: updatedAdmission,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
export const deleteAdmission = async (req, res) => {
    try {
        const { id } = req.params;

        const admission = await Admission.findByIdAndDelete(id);

        if (!admission) {
            return res.status(404).json({
                success: false,
                message: "Admission not found",
            });
        }

        res.json({
            success: true,
            message: "Admission deleted",
            admission,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


