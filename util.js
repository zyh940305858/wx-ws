function generateRandomNumber(digits) {
    if (digits <= 0) {
        throw new Error("位数必须是正整数");
    }

    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    generateRandomNumber
}