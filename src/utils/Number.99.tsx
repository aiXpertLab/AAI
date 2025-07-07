

export const formatDecimalInput = (text: string): string => {
    let cleanedText = text.replace(/[^0-9.]/g, '');

    const parts = cleanedText.split('.');
    if (parts.length > 2) {
        cleanedText = parts[0] + '.' + parts.slice(1).join('');
    }

    if (parts.length === 2) {
        cleanedText = parts[0] + '.' + parts[1].slice(0, 2);
    }

    if (cleanedText === '.') cleanedText = '0.';

    return cleanedText;
};

export const formatDecimalOnBlur = (value: string): string => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
        return num.toFixed(2);
    }
    return "0.00";
};


