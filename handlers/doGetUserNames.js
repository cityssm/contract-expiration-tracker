import { getUserNames } from "../helpers/contractDB/getUserNames.js";
export const handler = async (_request, response) => {
    const userNames = getUserNames();
    response.json({
        userNames
    });
};
export default handler;
