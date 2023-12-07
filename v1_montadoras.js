import {obter_numero, obter_texto, print, clear_screen, deseja_salvar, enter_to_continue} from './utils.js'
import {contem_valor} from './funcoes_gerais.js'
import { lista_de_montadoras } from './principal.js'
import { ulid } from "ulidx";
import {readFileSync, writeFileSync} from 'fs';
import { bubbleSort } from './funcoes_gerais.js';
import { load_modelos, print_modelos, salvar_modelos } from './v2_modelos.js';
import { load_veiculos, print_veiculos, salvar_veiculos } from './v3_veiculos.js';

//Solicita que o usuário informe os dados da nova montadora
export function adicionar_nova_montadora(){
    print(`>>> DADOS DA MONTADORA <<<`)
    let dados = {
        //Método ulid gera um id automático único 
        id: ulid(),
        nome: obter_texto('Nome: '),
        pais: obter_texto('País: '),
        ano: obter_numero('Ano de fundação: ')
    }
    //Armazena os dados fornecidos no vetor global
    lista_de_montadoras.push(dados)
    print('\n>> Referente a Montadoras:')
    //Pergunta se o usuário deseja salvar os dados recém inseridos 
    //A função passada, percorrer o vetor de montadoras adicionando os dados em suas respectivas chaves
    deseja_salvar(salvar_montadoras, lista_de_montadoras)
}

//Solicita dados de listagem ao usuário
function pedir_dados_listagem(){
    print('\n>> LISTAGEM DE MONTADORAS <<')
    let valor_correto = false
    let propriedade
    let ordem

    //Loop de validação de valores corretos para propriedade e ordem
    while(valor_correto != true){
        propriedade = obter_texto('\nInforme o nome da propriedade que deseja listar (nome, pais, ano): ').toLowerCase()
        ordem = obter_texto('Informe a ordenacao desejada ASC (Ascendente) ou DESC (Descendente): ').toUpperCase()

        //Verifica se os valores fornecidos são válidos
        if((propriedade === 'nome' || propriedade === 'pais' || propriedade === 'ano') && (ordem === 'ASC' || ordem === 'DESC')){
            valor_correto = true
        }else{
            print('\n> Informe valores de propriedade e ordenação válidos!')
        }
    }
    //Retorna os dados de propriedade e ordem
    return {propriedade, ordem}
    
}

//Função para imprimir as montadoras
export function print_montadoras(montadoras_ordenadas){
    print(`\n>>> MONTADORAS <<<`)
    //Imprime cada montadora da lista de montadoras
    for(let i = 0; i < montadoras_ordenadas.length; i++){
        print(`\n *** Montadora ${i+1} ***`);
        print(`   ID: ${montadoras_ordenadas[i].id}`)
        print(`   Nome: ${montadoras_ordenadas[i].nome}`)
        print(`   País: ${montadoras_ordenadas[i].pais}`)
        print(`   Ano de Fundação: ${montadoras_ordenadas[i].ano}`)
        print('---------------------------')
    }
    //Mostra a quantidade de montadoras cadastradas
    print(`\n>>> Status: Temos ${montadoras_ordenadas.length} montadoras cadastradas! <<<`)
}

//Função para listar e ordenar um vetor de dados
//Parâmetros:
//vetor: Vetor a ser listado e ordenado (lista_de_montadoras)
//valor: String que representa o tipo de valor sendo listado (ex: 'montadoras') .(Obs: ia fazer uma função genérica, mas não deu certo)
//funcao: Função de impressão a ser aplicada ao vetor ordenado
export function listar_vetor(vetor, valor, funcao){
    //Verifica se o vetor contém montadoras cadastradas
    if(vetor.length > 0){
        //Solicita dados (propriedade: nome, país, ano; e a ordem: asc ou desc) para a ordenação
        const dados = pedir_dados_listagem()
        //Ordena o vetor usando o algoritmo Bubble Sort
        const vetor_ordenado = bubbleSort(vetor, dados.propriedade, dados.ordem)
        //Imprime o vetor ordenado
        funcao(vetor_ordenado)
        //Retorna o vetor ordenado, mas sua ordenação não substitui a sequência de cadastro
        return vetor_ordenado
    }else{
        //Não lista nada e informa que não há montadoras cadastradas
        print(`\n> Nenhum(a) ${valor} cadastrado(a)!`)
    }
}

//Função para atualizar as montadoras
export function atualizar_montadoras(montadoras){
    //Função para listar as montadoras ordenadas
    listar_vetor(montadoras, 'Montadora', print_montadoras)
    let indice_usuario = obter_numero('\nInforme o numero da montadora que deseja alterar: ')
    //Reduz o índice em 1 pois o print não inicia com vetor na posição 0
    let indice = indice_usuario - 1
    let encontrado = false
    //Loop de validação do índice
    while(encontrado != true){
        //Verifica se o índice está dentro do comprimento do vetor
        if(indice >= 0 && indice < montadoras.length){
            let propriedade = obter_texto('Informe o nome da propriedade que deseja alterar (nome, pais, ano): ').toLowerCase()
            //Verifica as propriedades e atribui a elas o novo valor
            if(propriedade === 'nome'){
                montadoras[indice].nome = obter_texto(`Informe o novo nome da Montadora ${indice_usuario}: `)
            }else if(propriedade === 'pais'){
                montadoras[indice].pais = obter_texto(`Informe o novo pais da Montadora ${indice_usuario}: `)
            }else if(propriedade === 'ano'){
                montadoras[indice].ano = obter_numero(`Informe o novo ano de fundacao da Montadora ${indice_usuario}: `)
            }
            //Encerra o loop
            encontrado = true
        }else{
            //Caso o índice não esteja dentro do comprimento do vetor, pede outro.
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero da montadora que deseja remover: ')
            indice = indice_usuario - 1
        }
    }
    clear_screen()
    print(`\n> Montadora ${indice_usuario} alterada com sucesso!`)
    //Retorna o vetor montadoras com os valores atualizados.
    return montadoras
}
//Função para filtrar com base no índice escolhido pelo usuário
export function filtrar_indice(montadoras){
    //Lista as montadoras, se houver
    listar_vetor(montadoras, 'Montadora', print_montadoras)
    let encontrado = false
    //Loop de validação do índice no vetor
    while(encontrado != true){
        let indice_usuario = obter_numero('Informe o numero da Montadora: ')
        let indice = indice_usuario - 1
        //Verifica se o índice está no comprimento do vetor
        if(indice >= 0 && indice < montadoras.length){
            encontrado = true
            //Retorna a montadora cadastrada no índice informado
            return montadoras[indice]
        }else{
            //Caso o índice não existir no vetor, ele inicia o loop novamente
            print('\nIndice nao encontrado ou invalido!')
        }
    }
    clear_screen()
}

//Função para filtrar com base no nome da montadora ou parte dele, que é o valor buscado
export function filtrar_nome(nome_montadora){
    let montadoras_filtradas = []
    //Percorre cada montadora da lista
    for(let montadora of lista_de_montadoras){
        //Verifica qual montadora contém o valor buscado
        if(contem_valor(nome_montadora, montadora.nome)){ //Valor buscado e valor da propriedade
            //Se encontrar, armazena no vetor de montadoras_filtradas
            montadoras_filtradas.push(montadora)
        }
    }
    return montadoras_filtradas
}

export function filtrar_pais(pais_montadora){
    let montadoras_filtradas = []
    for(let montadora of lista_de_montadoras){
        if(contem_valor(pais_montadora, montadora.pais)){
            montadoras_filtradas.push(montadora)
        }
    }
    return montadoras_filtradas
}

export function filtrar_ano(ano_montadora){
    let montadoras_filtradas = []
    for(let montadora of lista_de_montadoras){
        if(contem_valor(ano_montadora, montadora.ano)){
            montadoras_filtradas.push(montadora)
        }
    }
    return montadoras_filtradas
}
//Função que faz a filtragem das montadoras com base no valor que deseja buscar
export function filtrar_montadoras(montadoras){
    //Verifica se o vetor não está vazio
    if(montadoras.length > 0){
        //Pede os dados de propriedade e ordem 
        let dados = pedir_dados_listagem()
        //Pede o valor que deseja buscar na propriedade
        let valor = obter_texto('Informe o valor que deseja buscar: ')
        let lista_montadoras_filtradas = []
        let resultado = false
        //Loop de validação da propriedade
        while(resultado != true){
            
            if(dados.propriedade === 'nome'){
                //Separa os registros que possuem o valor buscado em sua propriedade, os filtrados
                lista_montadoras_filtradas = filtrar_nome(valor)
                resultado = true
                
            }else if(dados.propriedade === 'pais'){
                lista_montadoras_filtradas = filtrar_pais(valor)
                resultado = true
                
            }else if(dados.propriedade === 'ano'){
                lista_montadoras_filtradas = filtrar_ano(valor)
                resultado = true

            }else{
                print('\n>> Propriedade inválida !!!')
                dados = pedir_dados_listagem()
                valor = obter_texto('Informe o valor que deseja buscar: ')
            }
        }   
        //Aplica o bubble sort no vetor de montadoras filtradas para ordená-lo
        const montadoras_ordenadas = bubbleSort(lista_montadoras_filtradas, dados.propriedade, dados.ordem)
        print_montadoras(montadoras_ordenadas)
    //Se o vetor inicial estiver vazio, informa ao usuário
    }else{
        print('Nenhuma Montadora cadastrada!')
    }

}

//Função para remover o registro de montadoras desejado
export function remover(){
    //Carrega novamente os dados do arquivo txt e armazena-os em um vetor
    let montadoras = []
    montadoras = load_montadoras()
    let modelos = []
    modelos = load_modelos()
    let veiculos = []
    veiculos = load_veiculos()
    //Verifica se o vetor possui alguma montadora cadastrada
    if(montadoras.length > 0){
        //Mostra ao usuárioa as montadoras
        print_montadoras(montadoras)
        //Pede o índice da montadora que deseja remover
        let indice_usuario = obter_numero('\nInforme o numero da montadora que deseja remover: ')
        let indice = indice_usuario - 1
        let indice_correto = false
    
        let confirmar_remocao
        //Loop de validação do índice
        while(indice_correto != true){
            //Verifica se o índice real está dentro do comprimento do vetor
            if(indice >= 0 && indice < montadoras.length){
                
                let modelos_associados = []
                //Percorre a lista de modelos
                for(let i = 0; i < modelos.length; i++){
                    //Verifica se há algum modelo associado à montadora no índice informado, comparando pelo id de montadora, que é contém no modelo do veículo ao ser cadastrado
                    if(modelos[i].montadora_id === montadoras[indice].id){
                        //Se for o mesmo valor, adiciona o modelo associado à um vetor
                        modelos_associados.push(modelos[i])
                    }
                }
                //Segue o mesmo processo anterior, verificando se há veículos associados à montadora informada
                let veiculos_associados = []
                for(let i = 0; i < veiculos.length; i++){
                    if(veiculos[i].montadora_id === montadoras[indice].id){
                        veiculos_associados.push(veiculos[i])
                    }
                }
                
                //Verifica se há modelos associados
                if(modelos_associados.length > 0){
                    print(`\n> A Montadora ${montadoras[indice].nome} possui Modelos associados a ela!`)
                    //Mostra quais são associados à montadora escolhida
                    print_modelos(modelos_associados)
                    //Verifica se há veiculos associados
                    if(veiculos_associados.length > 0){
                        print(`\n> A Montadora ${montadoras[indice].nome} possui Veiculos associados a ela!`)
                        print_veiculos(veiculos_associados)
                    }
                    //Após essas informações, pergunta se o uduário deseja realmente remover a montadora
                    confirmar_remocao = obter_texto(`\n> Deseja remover mesmo assim? (S - sim ou N - nao): `).toUpperCase()
        
                    if(confirmar_remocao === 'S'){
                        //Se sim, remove a montadora
                        //índice: indice real da montadora; 1: qtd de montadoras a ser removida.
                        montadoras.splice(indice, 1)
                        //Percorre o vetor modelos
                        for(let i = 0; i < modelos.length; i++){
                            //Percorre o vetor modelos_associados
                            for(let j = 0; j < modelos_associados.length; j++){
                                //Verifica se o id do modelo é igual ao id do modelo associado
                                if(modelos[i].id === modelos_associados[j].id){
                                    // Se os ids são iguais, remove o modelo associado do vetor modelos
                                    modelos.splice(i, 1)
                                }
                            }
                        }
                        //Verifica se há veículos associados à montadora e repete o processo anterior
                        if(veiculos_associados.length > 0){
                            for(let i = 0; i < veiculos.length; i++){
                                for(let j = 0; j < veiculos_associados.length; j++){
                                    if(veiculos[i].id === veiculos_associados[j].id){
                                        veiculos.splice(i, 1)
                                    }
                                }
                            }
                            //Se tiver veículos associados
                            print(`\n> Montadora ${indice_usuario}, ${modelos_associados.length} modelo(s) e ${veiculos_associados.length} veiculo(s) associado(s) removidos com sucesso!`)

                        }else{
                            //Se não tiver veículos associados
                            print(`\n> Montadora ${indice_usuario} e ${modelos_associados.length} modelo(s) associado(s) removidos com sucesso!`)
                        }
                    //Caso o usuário não desejar remover, imprime a msg 
                    }else if(confirmar_remocao === 'N'){
                        print(`\n> Montadora ${indice_usuario} nao removida!`)
                    //Se ele digitar uma resposta diferente de 's' ou 'n' 
                    }else{
                        print(`\n> Resposta Inválida!`)
                    }
                //Se não houver modelos associados à montadoras, ele remove só montadora.
                }else{
                    print(`\n> Nao existem modelos associados a essa Montadora!`)
                    montadoras.splice(indice, 1)
                    print(`\n> Montadora ${indice_usuario} removida com sucesso!`)
                }
                indice_correto = true
            //Se o índice não existir no vetor, pede novamente
            }else{
                print('\nÍndice não encontrado ou inválido!')
                indice_usuario = obter_numero('\nInforme o numero da montadora que deseja remover: ')
                indice = indice_usuario - 1
            }
        }
        //Pergunta se deseja salvar em arquivo as remoções
        print('\n>> Referente a Montadoras:')
        deseja_salvar(salvar_montadoras, montadoras)
        enter_to_continue()
        print('\n>> Referente a Modelos de Veículos:')
        deseja_salvar(salvar_modelos, modelos)
        enter_to_continue()
        print('\n>> Referente a Veículos:')
        deseja_salvar(salvar_veiculos, veiculos)
    //Se o vetor montadoras for <= 0, mostra a msg.
    }else{
        print('\n> Nao ha montadoras cadastradas!')
    }
    //Retorna os 3 novos vetores sem os registros que foram removidos
    return {montadoras, modelos, veiculos}
}

//Carrega os dados de montadoras do arquivo montadoras.txt
export function load_montadoras(){
    //Vetor para armazenar os registros de montadoras
    const vetor = []
    //Lê o conteúdo do arquivo
    const conteudo = readFileSync('montadoras.txt', 'utf-8')
    //Divide o conteúdo em linhas com base no caractere de nova linha(\n)
    const linhas = conteudo.split('\n')

    //Percorre cada linha do arquivo
    for(const linha of linhas){
        //Divide cada linha em valores usando o caractere '|'
        const valores = linha.split('|')
        //Verifica se a linha possui os valores esperados (id, nome, pais, ano)
        if (valores.length === 4) {
            //Extrai os valores individuais
            const id = valores[0]
            const nome = valores[1]
            const pais = valores[2]
            const ano = valores[3]
            
            //Cria um registro de montadora e adiciona ao vetor
            vetor.push({ id, nome, pais, ano })
        }
    }
    //Retorna o vetor contendo os registros de montadoras
    return vetor
}

//Adiciona os dados de montadoras no arquivo
export function salvar_montadoras(vetor) {
    //Registro contendo as informações a serem gravadas no arquivo como string
    let arquivo = ''
    //Percorre todo vetor de montadoras
    for(let registro of vetor){
        //Adiciona em cada propriedade/chave o valor informado
        //Os registros são salvos linha a linha (\n), separando suas propriedades por (|)
        const conteudo = `${registro.id}|${registro.nome}|${registro.pais}|${registro.ano}\n`
        arquivo += conteudo
    }
    //Escreve o conteúdo do 'arquivo' no arquivo 'montadoras.txt' 
    writeFileSync('montadoras.txt', arquivo, 'utf-8')
}
