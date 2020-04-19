export const ERRORS_CONSTANTS = {
    DB: {
        23505: (entityName: string): string => `${entityName} already exists.`
    },
    CODES: {
        INVALID_CREDENTIALS: 'ERROR.INVALID_CREDENTIALS',
        INVALID_CODE_ACTIVATION: 'ERROR.INVALID_CODE_ACTIVATION',
        USER_NOT_FOUND: 'ERROR.USER_NOT_FOUND'
    }
};