//Verifica se a palavra ou parte dela coincide com o valor da propriedade a ser filtrada
export function contem_valor(parte_palavra, palavra){
    //Divide a palavra usando parte_palavra como delimitador
    //Cria um array contendo partes da string original separadas pelo valor de parte_palavra. 
    const string_quebrada = palavra.split(parte_palavra)
    //Verifica se o valor buscado foi encontrado
    if(string_quebrada.length > 1){
        //Se há mais de uma parte, significa que parte_palavra está contida em palavra
        return true
    }else{
        //Se há apenas uma parte, não há coincidência completa com parte_palavra
        return false
    }
}

// Compara de dois em dois itens do vetor com base na propriedade desejada
export function comparar_itens_propriedade(item_posicao_anterior, item_proxima_posicao, propriedade) {
    let valor1 = item_posicao_anterior[propriedade]
    let valor2 = item_proxima_posicao[propriedade]

    //Converte valores numéricos, se as propriedades se referirem a dados numéricos
    //Essa conversão é feita pois a ordenação de string é diferente da numérica 
    if (propriedade === 'ano' || propriedade === 'valor' || propriedade === 'motorizacao'){
        valor1 = Number(valor1)
        valor2 = Number(valor2)    
    }
    //Compara os valores e retorna um resultado a ser usado para trocar as posições
    if (valor1 < valor2){
        return -1
    }else if (valor1 > valor2){
        return 1
    }else{
        return 0
    }

}

//Função para trocar a posição de dois elementos em um vetor
export function trocar_elementos_posicao(vetor, indice_atual, proximo_indice) {
    //Armazena o valor atual em uma variável temporária, para não sobrescrever
    const variavel_temporaria = vetor[indice_atual]
    //Atual recebe o próximo e próximo recebe atual, trocando as posições
    vetor[indice_atual] = vetor[proximo_indice]
    vetor[proximo_indice] = variavel_temporaria
}

//Função de ordenação usando o Bubble Sort
export function bubbleSort(vetor, propriedade, ordem) {
    const qtd_itens_vetor = vetor.length

    //Esses dois 'for' servem para percorrer o vetor, para fazer uma comparação do elemento atual com o próximo. 
    for (let i = 0; i < qtd_itens_vetor - 1; i++) {
        for (let j = 0; j < qtd_itens_vetor - 1 - i; j++){
            //Compara os elementos com base na propriedade e ordem fornecidas
            const comparacao = comparar_itens_propriedade(vetor[j], vetor[j + 1], propriedade)
            if ((ordem === 'ASC' && comparacao > 0) || (ordem === 'DESC' && comparacao < 0)){
                //Troca os elementos
                trocar_elementos_posicao(vetor, j, j + 1)
            }
        }
    }
    //Retorna o vetor ordenado
    return vetor
}
