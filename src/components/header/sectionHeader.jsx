import { motion } from "framer-motion";
import { useParams } from "next/navigation";

const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
};

const PageHeader = ({
    containerClassName = "",
    titlePrefix = "",
    titleClassName = "",
    descriptionClassName = "",
    description = "",
    descriptionPosition = "inline", // Options: "inline", "right", "below"
}) => {
    const { slug } = useParams();
    const capitalizedSlug = capitalizeFirstLetter(slug);

    return (
        <motion.div
            className={`flex ${descriptionPosition === "below" ? "flex-col items-start" : "items-baseline"} justify-between ${containerClassName}`}
        >
            <h1 className={`text-subheading ${titleClassName}`}>
                {titlePrefix} {capitalizedSlug}
            </h1>
            {description && (
                <span
                    className={`text-description text-xs ${descriptionClassName} ${descriptionPosition === "right" ? "ml-auto" : ""
                        }`}
                >
                    {description}
                </span>
            )}
        </motion.div>
    );
};

export default PageHeader;
