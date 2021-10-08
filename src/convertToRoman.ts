const baseNumbers = [
    { arabic: 500, roman: 'D', threshold: 100},
    { arabic: 100, roman: 'C', threshold: 10},
    { arabic: 50, roman: 'L', threshold: 10},
    { arabic: 10, roman: 'X', threshold: 1},
    { arabic: 5, roman: 'V', threshold: 1},
    { arabic: 1, roman: 'I', threshold: 0},
    { arabic: 0, roman: '', threshold: 0}
]



export function convertToRoman(arabicNumber: number): string {
    for(const baseNumber of  baseNumbers){
        if(arabicNumber === baseNumber.arabic - baseNumber.threshold ){
            return baseNumbers.find( n => n.arabic === baseNumber.threshold).roman +  baseNumber.roman
        }
        if(arabicNumber >= baseNumber.arabic){
            return baseNumber.roman + convertToRoman(arabicNumber - baseNumber.arabic)
        }
    }
    return ""

    /*
    if(arabicNumber >= baseNumbers[0].arabic){
        return baseNumbers[0].roman + convertToRoman(arabicNumber - baseNumbers[0].arabic)
    }
    if(arabicNumber === baseNumbers[0].arabic - baseNumbers[0].threshold ){
        return baseNumbers.find( n => n.arabic === baseNumbers[0].threshold).roman +  baseNumbers[0].roman
    }
    if(arabicNumber >= baseNumbers[1].arabic){
        return baseNumbers[1].roman + convertToRoman(arabicNumber - baseNumbers[1].arabic)
    }
    if(arabicNumber === baseNumbers[1].arabic - baseNumbers[1].threshold){
        return baseNumbers.find( n => n.arabic === baseNumbers[1].threshold).roman +  baseNumbers[1].roman
    }
    if(arabicNumber >= baseNumbers[2].arabic){
        return baseNumbers[2].roman + convertToRoman(arabicNumber - baseNumbers[2].arabic)
    }
    if(arabicNumber === baseNumbers[2].arabic - baseNumbers[2].threshold){
        return baseNumbers.find( n => n.arabic === baseNumbers[2].threshold).roman +  baseNumbers[2].roman
    }
    return ''
    */
}
