import { lista_de_modelos, lista_de_montadoras } from "./principal.js"
import { obter_texto, obter_numero, obter_boolean, print, clear_screen, enter_to_continue } from "./utils.js"
import {contem_valor} from './funcoes_gerais.js'
import { filtrar_indice } from "./v1_montadoras.js"
import { bubbleSort } from './funcoes_gerais.js';
import {readFileSync, writeFileSync} from 'fs';
import { ulid } from "ulidx";

//Função para adicionar um novo modelo de veículo
export function adicionar_modelo(lista_de_modelos, lista_de_montadoras) {
    //Mostra as montadoras filtrando por propriedade para escolher em qual montadora deseja cadastrar o modelo
    if (lista_de_montadoras.length > 0) {
        listar_vetor(lista_de_montadoras, 'Montadora', print_montadoras)
        
        let indice_usuario_montadora = obter_numero('\nNúmero da montadora que deseja cadastrar o modelo: ')
        let indice_montadora = indice_usuario_montadora - 1
        
        let indice_correto = false

        while(indice_correto != true) {
            if(indice_montadora >= 0 && indice_montadora < lista_de_montadoras.length) {
                clear_screen()
                print(`\n>>> DADOS DO MODELO DO VEÍCULO <<<`)
                let dados = {
                    id: ulid(),
                    modelo: obter_texto('Nome: '),
                    montadora_id: lista_de_montadoras[indice_montadora].id,
                    montadora_nome: lista_de_montadoras[indice_montadora].nome,
                    valor: obter_numero('Valor referência: ').toFixed(2),
                    motorizacao: obter_numero('Motorização (potência ou cilindradas): ').toFixed(1),
                    turbo: obter_boolean('Turbo (S - sim ou N - não): '),
                    automatico: obter_boolean('Automático (S - sim ou N - não): ')
                }
                
                //Coloca no vetor global os modelos recém adicionados
                lista_de_modelos.push(dados)
                indice_correto = true
            }else{
                //Caso o índice não exista no vetor, informa ao usuário e solicita novamente
                print('\nÍndice não encontrado ou inválido!')
                indice_usuario_montadora = obter_numero('\nNúmero da montadora que deseja cadastrar o modelo: ')
                indice_montadora = indice_usuario_montadora - 1
            }
        }
    }else{
        print('\n> Não há montadoras cadastradas. Cadastre uma montadora primeiro.')
    }
}


//Carrega os registros do arquivo separando-os em linhas
export function load_modelos(){
    const vetor = []
    const conteudo = readFileSync('modelos.txt', 'utf-8')
    const linhas = conteudo.split('\n')
    //Cada registro é separado por '|'
    for(const linha of linhas){
        const valores = linha.split('|')
        //Verifica a quantidade de propriedades existentes de cada registro
        if (valores.length === 8) {
            const id = valores[0]
            const modelo = valores[1]
            const montadora_id = valores[2]
            const montadora_nome = valores[3]
            const valor = valores[4]
            const motorizacao = valores[5]
            const turbo = valores[6]
            const automatico = valores[7]
            //Armazena essas propriedades em um vetor
            vetor.push({ id, modelo, montadora_id, montadora_nome, valor, motorizacao, turbo, automatico })
        }
    }
    return vetor
}

//Função para salvar os dados no arquivo txt
export function salvar_modelos(vetor) {
    let arquivo = ''
    for(let registro of vetor){
        //Adiciona em cada propriedade/chave o valor informado
        const conteudo = `${registro.id}|${registro.modelo}|${registro.montadora_id}|${registro.montadora_nome}|${registro.valor}|${registro.motorizacao}|${registro.turbo}|${registro.automatico}\n`
        arquivo += conteudo
    }
    //Escreve o conteúdo do 'arquivo' no arquivo 'modelos.txt' 
    writeFileSync('modelos.txt', arquivo, 'utf-8')
}

//Função para pedir propriedade e ordem e validá-las
export function pedir_dados_listagem_modelos(){
    print('\n>> LISTAGEM MODELOS DE VEÍCULOS <<')
    let valor_correto = false
    let propriedade
    let ordem

    while(valor_correto != true){
        propriedade = obter_texto('\nInforme o numero referente a propriedade que deseja listar (modelo, montadora_nome, valor, motorizacao): ').toLowerCase()
        ordem = obter_texto('Informe a ordenacao desejada ASC (Ascendente) ou DESC (Descendente): ').toUpperCase()

        if((propriedade === 'modelo' || propriedade === 'montadora_nome' || propriedade === 'valor' || propriedade === 'motorizacao') && (ordem === 'ASC' || ordem === 'DESC')){
            valor_correto = true
        }else{
            print('\n> Informe valores de propriedade e ordenação válidos!')
        }
    }
    return {propriedade, ordem}
}

/*Função para listar os modelos cadastrados
Parâmetros: 
vetor: contendo os modelos cadastrados
valor: que imprime a palavra 'Modelo'
funcao: print_modelos, para imprimir os modelos contidos no vetor
*/
export function listar_modelos(vetor, valor, funcao){
    //Verifica se o vetor está vazio
    if(vetor.length > 0){
        //Pede a propriedade e a ordem que deseja listar
        const dados = pedir_dados_listagem_modelos()
        //Ordena o vetor
        const vetor_ordenado = bubbleSort(vetor, dados.propriedade, dados.ordem)
        //Imprime o vetor ordenado
        funcao(vetor_ordenado)
    //Se o vetor estiver vazio, mostra a msg
    }else{
        print(`\n> Nenhum(a) ${valor} cadastrado(a)!`)
    }
}

//Função que imprime o vetor modelos 
export function print_modelos(modelos_ordenados){
    enter_to_continue()
    print(`\n>>> MODELOS DE VEÍCULOS <<<`)
    for(let i = 0; i < modelos_ordenados.length; i++){
        print(`\n *** Modelo ${i+1} ***`)
        print(`   ID: ${modelos_ordenados[i].id}`)
        print(`   Modelo: ${modelos_ordenados[i].modelo}`)
        print(`   ID Montadora: ${modelos_ordenados[i].montadora_id}`)
        print(`   Nome Montadora: ${modelos_ordenados[i].montadora_nome}`)
        //Como valores numéricos são carregados do documento com string, faz-se a conversão para ordenar corretamente
        print(`   Valor de Ref.: R$ ${Number(modelos_ordenados[i].valor).toFixed(2)}`)
        print(`   Motorizacao (cilindradas): ${Number(modelos_ordenados[i].motorizacao).toFixed(1)}`)
        //Substitui o valor da string 'true' para 'Sim', se ele for turbo e 'Não' se o inverso.
        print(`   Turbo: ${modelos_ordenados[i].turbo ? 'Sim':'Nao'}`)
        //O mesmo é feito para automático
        print(`   Automático: ${modelos_ordenados[i].automatico ? 'Sim':'Nao'}`)
        print('---------------------------')
    }
    //Mostra a quantidade de modelos cadastrados
    print(`\n>>> Status: Temos ${modelos_ordenados.length} modelo(s) cadastrado(s)! <<<`)
}

//Filtra por propriedade
export function filtrar_modelo(nome_modelo){
    let modelos_filtrados = []
    for(let registro of lista_de_modelos){
        //Verifica em cada registro se contém o valor informado da sua respectiva propriedade
        if(contem_valor(nome_modelo, registro.modelo)){
            //Armazena em um vetor os modelos filtrados
            modelos_filtrados.push(registro)
        }
    }
    return modelos_filtrados
}
//Filtra da mesma forma que o anterior, mudando apenas a propriedade
export function filtrar_montadora(nome_montadora){
    let montadoras_filtradas = []
    for(let registro of lista_de_modelos){
        if(contem_valor(nome_montadora, registro.montadora_nome)){
            montadoras_filtradas.push(registro)
        }
    }
    return montadoras_filtradas
}

export function filtrar_valor(valor_modelo){
    let modelos_filtrados = []
    for(let registro of lista_de_modelos){
        if(contem_valor(valor_modelo, registro.valor)){
            modelos_filtrados.push(registro)
        }
    }
    return modelos_filtrados
}

export function filtrar_motorizacao(motor){
    let modelos_filtrados = []
    for(let registro of lista_de_modelos){
        if(contem_valor(motor, registro.motorizacao)){
            modelos_filtrados.push(registro)
        }
    }
    return modelos_filtrados
}

//Função para filtrar os modelos
export function filtrar_modelos_veiculos(modelos){
    //Verifica se há modelos cadastrados
    if(modelos.length > 0){
        //Pede a propriedade e ordem desejada
        let dados = pedir_dados_listagem_modelos()
        //Pede o valor a se buscar
        let valor = obter_texto('Informe o valor que deseja buscar: ')
        let lista_modelos_filtrados = []
        let resultado = false
        //Loop de validação da propriedade
        while(resultado != true){
            //Verifica se a propriedade do vetor coincide com a informada
            if(dados.propriedade === 'modelo'){
                //Armazena os modelos filtrados com base no valor desejado em um vetor
                lista_modelos_filtrados = filtrar_modelo(valor)
                resultado = true
                
            }else if(dados.propriedade === 'montadora_nome'){
                lista_modelos_filtrados = filtrar_montadora(valor)
                resultado = true
                
            }else if(dados.propriedade === 'valor'){
                lista_modelos_filtrados = filtrar_valor(valor)
                resultado = true

            }else if(dados.propriedade === 'motorizacao'){
                lista_modelos_filtrados = filtrar_motorizacao(valor)
                resultado = true
            }else{
                print('\n>> Propriedade inválida !!!')
                dados = pedir_dados_listagem()
                valor = obter_texto('Informe o valor que deseja buscar: ')
            }
        }   
        //Ordena e imprime o vetor de modelos
        const modelos_ordenados = bubbleSort(lista_modelos_filtrados, dados.propriedade, dados.ordem)
        print_modelos(modelos_ordenados)
    }else{
        //Quando o vetor for <= 0
        print('\n> Nenhum Modelo cadastrado!')
    }

}

//Função para remover um modelo
export function remover_modelo(modelos){
    //Lista os modelos para o usuário escolher 1 pra remover, pelo índice
    listar_modelos(modelos, 'Modelo', print_modelos)
    let indice_usuario = obter_numero('\nInforme o numero do modelo que deseja remover: ')
    let indice = indice_usuario - 1
    let encontrado = false
    //Loop de validação do índice
    while(encontrado != true){
        //Verifica se esse índice existe no vetor
        if(indice >= 0 && indice < modelos.length){
            //Remove 1 modelo da lista de modelos, com base no índice informado
            modelos.splice(indice, 1)
            encontrado = true
        }else{
            //Se o índice for inválido, pede novamente
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero do modelo que deseja remover: ')
            indice = indice_usuario - 1
        }
    }
    clear_screen()
    print(`\n> Modelo ${indice_usuario} removido com sucesso!`)
    //Retorna o vetor com o registro removido
    return modelos
}
//Função para editar modelos
export function atualizar_modelos(modelos){
    //Lista os modelos com base na propriedade e ordem desejadas
    listar_modelos(modelos, 'Modelos', print_modelos)
    //Pede o indice referente ao modelo que deseja editar
    let indice_usuario = obter_numero('\nInforme o numero do Modelo que deseja alterar: ')
    let indice = indice_usuario - 1
    let encontrado = false
    clear_screen()
    print(`\n>> Atualização do Modelo ${indice_usuario} <<\n`)
    //Loop de validação do índice
    while(encontrado != true){
        //Se o índice estiver no comprimento do vetor
        if(indice >= 0 && indice < modelos.length){
            let dado_correto = false
            let propriedade
            //Loop de validação da propriedade
            while(dado_correto != true){
                propriedade = obter_texto('\nInforme o nome da propriedade que deseja alterar (modelo, valor, montadora_nome, motorizacao, turbo, automatico): ').toLowerCase()
                //Preenche as propriedades com os novos valores
                if(propriedade === 'modelo'){
                    modelos[indice].modelo = obter_texto(`Informe o novo nome do Modelo: `)
                    dado_correto = true
                }else if(propriedade === 'valor'){
                    modelos[indice].valor = obter_texto(`Informe o novo valor: `)
                    dado_correto = true
                }else if(propriedade === 'montadora_nome'){
                    clear_screen()
                    //Filtra a montadora com o índice informado para preencher
                    const montadora = filtrar_indice(lista_de_montadoras)
                    // Atribui o nome da montadora ao campo 'montadora_nome' no registro correspondente no vetor modelos
                    modelos[indice].montadora_nome = montadora.nome
                    dado_correto = true
                }else if(propriedade === 'motorizacao'){
                    modelos[indice].motorizacao = obter_numero(`Informe a nova motorizacao: `)
                    dado_correto = true
                }else if(propriedade === 'turbo'){
                    //A função obter_boolean converte a string para um valor booleano
                    modelos[indice].turbo = obter_boolean('Turbo (S - sim ou N - nao): ')
                    dado_correto = true
                }else if(propriedade === 'automatico'){
                    modelos[indice].automatico = obter_boolean('Automatico (S - sim ou N - nao): ')
                    dado_correto = true
                }
                print('\n> Informe uma propriedade válida!')
            }

            encontrado = true

        }else{
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero do Modelo que deseja alterar: ')
            indice = indice_usuario - 1
        }
    }
    clear_screen()
    print(`\n> Modelo ${indice_usuario} alterado com sucesso!`)
    //Retorna o vetor sem os modelos removidos
    return modelos
}

//Filtra o modelo com base no indice
export function filtrar_indice_modelos(modelos){
    listar_modelos(modelos, 'Modelo', print_modelos)
    let encontrado = false
    
    while(encontrado != true){
        let indice_usuario = obter_numero('Informe o numero do Modelo: ')
        let indice = indice_usuario - 1

        if(indice >= 0 && indice < modelos.length){
            encontrado = true
            return modelos[indice]
        }else{
            print('\nIndice nao encontrado ou invalido!')
        }
    }
    clear_screen()
}