import {question} from 'readline-sync';

//Pede um número ao usuário
export function obter_numero(descricao){
    return Number(question(descricao))
}

//Pede um número mínimo ao usuário
export function obter_numero_minimo(descricao, minimo){
    let numero = obter_numero(descricao)
    //Continua pedindo um número ao usuário, desde que ele digite dentro da faixa
    while (numero < minimo || numero > 9999){
        console.log(`ERROR: Digite um número >= ${minimo} ou <= 9999 !`)
        numero = obter_numero(descricao)
    }
    return numero
}

//Pede um número máximo ao usuário
export function obter_numero_maximo(descricao, maximo){
    let numero = obter_numero(descricao)

    //Continua pedindo um número ao usuário, desde que ele digite dentro da faixa
    while (numero < 1000 || numero > maximo){
        console.log(`ERROR: Digite um número >= 1000 ou <= ${maximo} !\n`)
        numero = obter_numero(descricao)
    }
    return numero
}

//Pede um texto/string ao usuário
export function obter_texto(descricao){
    return question(descricao)
}

//Imprime o parâmetro passado
export function print(descricao){
    console.log(descricao)
}

//Limpa a tela
export function clear_screen(){
    console.clear()
}

//Pede o usuário pra digitar enter, depois limpa a tela
export function enter_to_continue(){
    obter_texto('\n<enter>... to continue')
    clear_screen()
}

//Recebe um valor digitado pelo usuário e converte-o em booleano
export function obter_boolean(descricao){
    let valor_booleano = (question(descricao)).toUpperCase()
    let resposta = false
    
    while(resposta != true){
        if(valor_booleano === 'S'){
            resposta = true
            return true
        }else if(valor_booleano === 'N'){
            resposta = true
            return false
        }else{
            print('\n> Informe uma resposta válida!')
            valor_booleano = (question(descricao)).toUpperCase()
        }

    }
}

//Pergunta ao usuário se deseja salvar os dados, passando uma função e um vetor como parâmetro
export function deseja_salvar(funcao, vetor){
    let salvar = obter_texto('Deseja salvar os dados antes de sair? (S - sim ou N - nao): ').toUpperCase()
    let validacao = false

    while(validacao != true){
        if(salvar === 'S'){
            //Executa a função para salvar os dados no arquivo
            funcao(vetor)
            print('\n> Dados salvos com sucesso!')
            validacao = true
        }else if(salvar === 'N'){
            print('\n> Dados nao armazenados no arquivo!')
            validacao = true
        }else{
            salvar = obter_texto('Opção inválida ! Informe novamente. \nDeseja salvar os dados antes de sair? (S - sim ou N - nao): ').toUpperCase()
        }

    }
}
