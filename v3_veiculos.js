import { ulid } from "ulidx"
import { clear_screen, deseja_salvar, enter_to_continue, obter_boolean, obter_numero, obter_numero_maximo, obter_numero_minimo, obter_texto, print } from "./utils.js"
import { filtrar_indice, listar_vetor, load_montadoras, print_montadoras } from "./v1_montadoras.js"
import {readFileSync, writeFileSync} from 'fs';
import { lista_de_veiculos, lista_de_montadoras } from "./principal.js";
import { listar_modelos, load_modelos, print_modelos } from "./v2_modelos.js";
import { bubbleSort, contem_valor } from "./funcoes_gerais.js";

//Carrega os registros do txt linha a linha
export function load_veiculos(){
    const vetor = []
    const conteudo = readFileSync('veiculos.txt', 'utf-8')
    const linhas = conteudo.split('\n')

    for(const linha of linhas){
        const valores = linha.split('|')
        if (valores.length === 11) {
            const id = valores[0]
            const modelo_id = valores[1]
            const modelo_nome = valores[2]
            const montadora_id = valores[3]
            const montadora_nome = valores[4]
            const cor = valores[5]
            const ano_fabricacao = valores[6]
            const ano_modelo = valores[7]
            const valor = valores[8]
            const placa = valores[9]
            //Verifica se o elemento é uma string que contém o texto 'true', se sim, será atribuído o valor booleano true, se não, será atribuído o valor booleano false
            const vendido = valores[10] === 'true'
            
            /*Forma convencional:
                let vendido
                if (valores[10] === 'true') {
                    vendido = true
                } else {
                    vendido = false
                }
            */

            vetor.push({ id, modelo_id, modelo_nome, montadora_id, montadora_nome, cor, ano_fabricacao, ano_modelo, valor, placa, vendido })
        }
    }
    
    return vetor
}

//Salva os dados no arquivo txt
export function salvar_veiculos(vetor) {
    let arquivo = ''
    for(let registro of vetor){
        const conteudo = `${registro.id}|${registro.modelo_id}|${registro.modelo_nome}|${registro.montadora_id}|${registro.montadora_nome}|${registro.cor}|${registro.ano_fabricacao}|${registro.ano_modelo}|${registro.valor}|${registro.placa}|${registro.vendido}\n`
        arquivo += conteudo
    }
    writeFileSync('veiculos.txt', arquivo, 'utf-8')
}

//Adiciona um novo veículo
export function adicionar_veiculo(){
    //Carrega os registros dos arquivos txt
    let montadoras = []
    montadoras = load_montadoras()
    let modelos = []
    modelos = load_modelos()
    let veiculos = []
    veiculos = load_veiculos()
    //Verifica se há montadoras e modelos cadastrados
    if(montadoras.length > 0 && modelos.length > 0){
        //Se sim, lista, e pede o índice da montadora para cadastrar o veículo
        listar_vetor(montadoras, 'Montadora', print_montadoras)
        let indice_usuario_montadora = obter_numero('\nNumero da montadora que deseja cadastrar o veículo: ')
        let indice_montadora = indice_usuario_montadora - 1
        
        clear_screen()
        //Faz o mesmo para modelos
        listar_modelos(modelos, 'Modelo', print_modelos)
        let indice_usuario_modelo = obter_numero('\nNumero do modelo que deseja cadastrar o veículo: ')
        let indice_modelo = indice_usuario_modelo - 1
        let indice_correto = false

        //Loop de validação do índice
        while(indice_correto != true){
            //Verifica se o índice de montadoras e modelos existe
            if((indice_montadora >= 0 && indice_montadora < montadoras.length) && (indice_modelo >= 0 && indice_modelo < modelos.length)){
                //Verifica se o modelo está associado à montadora informados nos índices, baseado no id de montadora
                if(montadoras[indice_montadora].id === modelos[indice_modelo].montadora_id){
                    clear_screen()
                    //Pede ao usuário os dados do veículo
                    print(`\n>>> DADOS DO MODELO DO VEÍCULO <<<`)
                    let dados = {
                        id: ulid(),
                        //Carrega nas variaveis do veículo os ids e nomes de modelos e montadoras aos quais ele será associado
                        modelo_id: modelos[indice_modelo].id,
                        modelo_nome: modelos[indice_modelo].modelo,
                        montadora_id: montadoras[indice_montadora].id,
                        montadora_nome: montadoras[indice_montadora].nome,
                        cor: obter_texto('Cor: '),
                        ano_fabricacao: obter_numero('Ano de fabricação (AAAA): '),
                        ano_modelo: obter_numero('Ano do modelo (AAAA): '),
                        valor: obter_numero('Valor do Veiculo: R$ ').toFixed(2),
                        placa: obter_texto('Placa: '),
                        vendido: false  // Inicializado como não vendido
                    }
                    //Armazena os dados dos registros no vetor
                    veiculos.push(dados)
                    indice_correto = true
                }else{
                    //Se os índices não corresponderem a registros associados, repete os passos anteriores
                    print('\n> Os indices informados nao sao validos ou nao coincidem com o mesmo dado. \nInforme novamente!')
                    enter_to_continue()
                    listar_vetor(montadoras, 'Montadora', print_montadoras)
                    let indice_usuario_montadora = obter_numero('\nNumero da montadora que deseja cadastrar o veículo: ')
                    let indice_montadora = indice_usuario_montadora - 1
                    
                    listar_modelos(modelos, 'Modelo', print_modelos )
                    let indice_usuario_modelo = obter_numero('\nNumero do modelo que deseja cadastrar o veículo: ')
                    let indice_modelo = indice_usuario_modelo - 1

                }
            }
        }
        //Pergunta se o usuário desejar salvar os dados no txt
        print('\n>> Referente a Veículos:')
        deseja_salvar(salvar_veiculos, veiculos)
    }else{
        //Se não existirem montadoras ou modelos cadastrados, não dar pra adicionar um veículo
        print('\n> Nao ha montadoras e/ou modelos cadastrados!')
    }
    //Retorna o vetor de veículos
    return veiculos
}

//Pede a propriedade e ordem para listagem
export function pedir_dados_listagem_veiculos(){
    print('\n>> LISTAGEM DE VEÍCULOS <<')
    let valor_correto = false
    let propriedade
    let ordem

    while(valor_correto != true){
        propriedade = obter_texto('\nInforme o numero referente a propriedade que deseja listar (placa, ano_fabricacao, ano_modelo, valor, vendido, montadora_nome, modelo_nome): ').toLowerCase()
        ordem = obter_texto('Informe a ordenacao desejada ASC (Ascendente) ou DESC (Descendente): ').toUpperCase()

        if((propriedade === 'placa' || propriedade === 'ano_fabricacao' || propriedade === 'ano_modelo' || propriedade === 'valor' || propriedade === 'vendido' || propriedade === 'montadora_nome' || propriedade === 'modelo_nome') && (ordem === 'ASC' || ordem === 'DESC')){
            valor_correto = true
        }else{
            print('\n> Informe valores de propriedade e ordenação válidos!')
        }
    }
    return {propriedade, ordem}
}

//Faz a listagem dos vetores com base na sequência de cadastro
export function listar_veiculos(){
    let montadoras = []
    montadoras = load_montadoras()
    let modelos = []
    modelos = load_modelos()
    let veiculos = []
    veiculos = load_veiculos()
    
    //Verifica se há montadoras e modelos cadastrados
    if(montadoras.length > 0 && modelos.length > 0 && veiculos.length > 0){
        const dados = pedir_dados_listagem_veiculos()
        //Ordena o vetor
        const vetor_ordenado = bubbleSort(veiculos, dados.propriedade, dados.ordem)
        print_veiculos(vetor_ordenado)
        //Retorna o vetor veículos ordenado
        return vetor_ordenado

    }else{
        print('\n> Nao ha montadoras e/ou modelos e/ou veiculos cadastrados!\n> Verifique se você salvou os dados referente a montadoras e veiculos recem adicionados antes de adicionar veiculo <')
    }

}

//Imprime os dados do veículo, bem como montadora e modelo associados
export function print_veiculos(veiculos_ordenados){
    enter_to_continue()
    print(`\n>>> VEÍCULOS <<<`)
    for(let i = 0; i < veiculos_ordenados.length; i++){
        print(`\n *** Veiculo ${i+1} ***`)
        print(`   ID: ${veiculos_ordenados[i].id}`)
        print(`   ID Modelo: ${veiculos_ordenados[i].modelo_id}`)
        print(`   Nome Modelo: ${veiculos_ordenados[i].modelo_nome}`)
        print(`   ID Montadora: ${veiculos_ordenados[i].montadora_id}`)
        print(`   Nome Montadora: ${veiculos_ordenados[i].montadora_nome}`)
        print(`   Cor do veículo: ${veiculos_ordenados[i].cor}`)
        //Converte para número, para ordenar corretamente
        print(`   Ano de Fabricação: ${Number(veiculos_ordenados[i].ano_fabricacao)}`)
        print(`   Ano do Modelo: ${Number(veiculos_ordenados[i].ano_modelo)}`)
        print(`   Valor do Veiculo: R$ ${Number(veiculos_ordenados[i].valor).toFixed(2)}`)
        print(`   Placa: ${veiculos_ordenados[i].placa}`)
        let status_vendido = veiculos_ordenados[i].vendido
        //Se baseia no valor booleano para imprimir sim se o veículo tiver sido vendido, e o inverso caso não
        if(status_vendido === true){
            print(`   Vendido: Sim`)
        }else{
            print(`   Vendido: Nao`)
        }
        print('---------------------------')
    }
    //Retorna o vetor veículos ordenado
    print(`\n>>> Status: Temos ${veiculos_ordenados.length} veiculo(s) cadastrado(s)! <<<`)
}

//Filtra os veiculos com base na propriedade e no valor que o usuário deseja buscar no registro
export function filtrar_placa(placa_veiculo){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        if(contem_valor(placa_veiculo, registro.placa)){
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

export function filtrar_ano_fabricacao(ano_min, ano_max, ano_fab) {
    let veiculos_filtrados = [];
    
    for (let registro of lista_de_veiculos) {
        if(contem_valor(ano_fab, registro.ano_fabricacao)){
            if (registro.ano_fabricacao >= ano_min && registro.ano_fabricacao <= ano_max) {
                veiculos_filtrados.push(registro)
            }
        }
    }
    return veiculos_filtrados
}

export function filtrar_ano_modelo(ano_min, ano_max, ano_mod) {
    let veiculos_filtrados = [];
    
    for (let registro of lista_de_veiculos) {
        if(contem_valor(ano_mod, registro.ano_modelo)){
            if (registro.ano_modelo >= ano_min && registro.ano_modelo <= ano_max) {
                veiculos_filtrados.push(registro)
            }
        }
    }
    return veiculos_filtrados
}

export function filtrar_valor(valor_veiculo){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        if(contem_valor(valor_veiculo, registro.valor)){
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

//Filtra os veiculos com base na propriedade e no valor que o usuário deseja buscar no registro
export function filtrar_vendido(veiculo_vendido){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        const filtro = veiculo_vendido.toUpperCase() // Converte para maiúsculo para tratar S ou N
        //Verifica se o valor buscado é 'S' ou 'N' e se o valor booleano da propriedade é true ou false
        if ((filtro === 'S' && registro.vendido === true) || (filtro === 'N' && registro.vendido === false)) {
            //Se a condição for verdadeira, adiciona o registro ao vetor de veículos filtrados
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

export function filtrar_montadora_nome(nome_mont){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        if(contem_valor(nome_mont, registro.montadora_nome)){
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

export function filtrar_modelo_nome(nome_mod){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        if(contem_valor(nome_mod, registro.modelo_nome)){
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

//Funcao para filtrar veiculos
export function filtrar_veiculos(){
    //Verifica se possui veiculos cadastrados
    if(lista_de_veiculos.length > 0){
        //Fazer a listagem e pedir o valor a buscar
        let dados = pedir_dados_listagem_veiculos()
        let valor = obter_texto('Informe o valor que deseja buscar: ')
        let lista_veiculos_filtrados = []
        let resultado = false
        
        while(resultado != true){
            //Validação das propriedades
            if(dados.propriedade === 'placa'){
                lista_veiculos_filtrados = filtrar_placa(valor)
                resultado = true
            
            //Pede para o usúario informar um valor de até 4 casas decimais, sendo o máximo, não ultrapassando 2024
            }else if(dados.propriedade === 'ano_fabricacao'){
                print('\n> Forneça uma faixa de anos para a busca <')
                const ano_minimo = obter_numero_minimo('Informe o ano minimo: ', 1000)
                const ano_maximo = obter_numero_maximo('Informe o ano maximo: ', 2024)
                lista_veiculos_filtrados = filtrar_ano_fabricacao(ano_minimo, ano_maximo, valor)
                resultado = true
                
            }else if(dados.propriedade === 'ano_modelo'){
                print('\n> Forneça uma faixa de anos para a busca <')
                const ano_minimo = obter_numero_minimo('Informe o ano minimo: ', 1000)
                const ano_maximo = obter_numero_maximo('Informe o ano maximo: ', 2024)
                lista_veiculos_filtrados = filtrar_ano_modelo(ano_minimo, ano_maximo, valor)
                resultado = true
                    
            }else if(dados.propriedade === 'valor'){
                lista_veiculos_filtrados = filtrar_valor(valor)
                resultado = true
                
            }else if(dados.propriedade === 'vendido'){
                lista_veiculos_filtrados = filtrar_vendido(valor)
                resultado = true
                
            }else if(dados.propriedade === 'montadora_nome'){
                lista_veiculos_filtrados = filtrar_montadora_nome(valor)
                resultado = true
                
            }else if(dados.propriedade === 'modelo_nome'){
                lista_veiculos_filtrados = filtrar_modelo_nome(valor)
                resultado = true
            }else{
                print('\n>> Propriedade inválida !!!')
                dados = pedir_dados_listagem()
                valor = obter_texto('Informe o valor que deseja buscar: ')
            }
        }   
        //Ordena o vetor filtrado
        const veiculos_ordenados = bubbleSort(lista_veiculos_filtrados, dados.propriedade, dados.ordem)
        print_veiculos(veiculos_ordenados)
    }else{
        print('\n> Nenhum Modelo cadastrado!')
    }
    
}

//Função para editar veículos
export function atualizar_veiculos(){
    let veiculos = listar_veiculos()
    let indice_usuario = obter_numero('\nInforme o numero do Veiculo que deseja alterar: ')
    let indice = indice_usuario - 1
    let encontrado = false
    clear_screen()
    print(`\n>> Atualização do Veiculo ${indice_usuario} <<\n`)

    while(encontrado != true){
        if(indice >= 0 && indice < veiculos.length){
            let dado_correto = false
            let propriedade
            
            while(dado_correto != true){
                propriedade = obter_texto('\nInforme o nome da propriedade que deseja alterar (placa, ano_fabricacao, ano_modelo, valor, vendido, montadora_nome, modelo_nome): ').toLowerCase()
                if(propriedade === 'placa'){
                    veiculos[indice].placa = obter_texto(`Informe a nova placa do Veiculo: `)
                    dado_correto = true
                }else if(propriedade === 'ano_fabricacao'){
                    veiculos[indice].ano_fabricacao = obter_numero(`Informe o novo Ano de Fabricacao: `)
                    dado_correto = true
                }else if(propriedade === 'ano_modelo'){
                    veiculos[indice].ano_modelo = obter_numero(`Informe o novo Ano de Modelo: `)
                    dado_correto = true
                }else if(propriedade === 'valor'){
                    veiculos[indice].valor = obter_numero(`Informe o novo valor: R$ `)
                    dado_correto = true
                }else if(propriedade === 'vendido'){
                    //Adiciona o valor booleano conforme o valor digitado pelo usuário
                    let foi_vendido = obter_texto(`Vendido (S - sim ou N - nao): `).toUpperCase()
                    if(foi_vendido === 'S'){
                        veiculos[indice].vendido = true
                    }else if(foi_vendido === 'N'){
                        veiculos[indice].vendido = false
                    }
                    dado_correto = true
                }else if(propriedade === 'montadora_nome'){
                    clear_screen()
                    const montadora = filtrar_indice(lista_de_montadoras)
                    veiculos[indice].montadora_nome = montadora.nome
                    dado_correto = true
                }
                print('\n> Informe uma propriedade válida!')
            }
            encontrado = true

        }else{
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero do Veiculo que deseja alterar: ')
            indice = indice_usuario - 1
        }
    }
    //Pergunta se deseja salvar os dados em txt e retorna o vetor atualizado
    clear_screen()
    print(`\n> Veiculo ${indice_usuario} alterado com sucesso!`)
    enter_to_continue()
    print('\n>> Referente a Veículos:')
    deseja_salvar(salvar_veiculos, veiculos)
    return veiculos
}

//Função para remover veículos 
export function remover_veiculos(){
    let veiculos = listar_veiculos()
    let indice_usuario = obter_numero('\nInforme o numero do Veiculo que deseja remover: ')
    let indice = indice_usuario - 1
    let encontrado = false

    while(encontrado != true){
        if(indice >= 0 && indice < veiculos.length){
            veiculos.splice(indice, 1)
            encontrado = true
        }else{
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero do Veiculo que deseja remover: ')
            indice = indice_usuario - 1
        }
    }
    clear_screen()
    print(`\n> Veiculo ${indice_usuario} removido com sucesso!`)
    enter_to_continue()
    print('\n>> Referente a Veículos:')
    deseja_salvar(salvar_veiculos, veiculos)
    
    return veiculos
}
