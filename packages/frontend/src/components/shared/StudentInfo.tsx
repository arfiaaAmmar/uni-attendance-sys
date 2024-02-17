import { Avatar } from "@mui/material";
import { Student } from "shared-library/dist/types";

type StudentInfoProps = {
    student: Student;
};

export function StudentInfo({ student }: StudentInfoProps) {

    const details = [
        { label: 'Student Name', value: student?.name },
        { label: 'Student Id', value: student?.studentId },
        { label: 'Course', value: student?.course }
    ];

    return (
        <div className="border-l-2 pl-4">
            <Avatar style={{
                width: "100px",
                height: "100px"
            }} className="mx-auto mb-4" />
            {details.map(detail => (
                <>
                    <p className="text-neutral-500">{detail.label}</p>
                    <p className="text-xl">{detail.value}</p>
                </>
            ))}
        </div>
    );
}
