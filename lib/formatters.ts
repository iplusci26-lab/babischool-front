export function formatPersonName(
    lastName?: string,
    firstName?: string,
) {

    const last =
        (lastName || "").toUpperCase();

    const first =
        (firstName || "")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (c) => c.toUpperCase()
            );

    return `${last} ${first}`.trim();

}