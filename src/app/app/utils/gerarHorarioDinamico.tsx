/**
 * Converte "HH:mm" em minutos desde 00:00.
 */
function hhmmParaMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((parte) => parseInt(parte, 10));
  return h * 60 + m;
}

/**
 * Converte um total de minutos em "HH:mm" com dois dígitos em cada parte.
 */
function minutosParaHhmm(totalMinutos: number): string {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  const hh = String(horas).padStart(2, "0");
  const mm = String(minutos).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Gera um array de strings "HH:mm" com todos os horários de início de atendimento
 * que:
 *  - Completam `duracaoMinutos` sem ultrapassar `horaFechamento`.
 *  - Não se sobrepõem ao intervalo de descanso [inicioIntervalo, fimIntervalo].
 *
 * @param horaAbertura     - Formato "HH:mm", ex: "09:00"
 * @param horaFechamento   - Formato "HH:mm", ex: "19:30"
 * @param duracaoMinutos   - Duração de cada atendimento, em minutos (ex: 60)
 * @param inicioIntervalo  - Formato "HH:mm" para início do descanso (ex: "13:00")
 * @param fimIntervalo     - Formato "HH:mm" para fim do descanso (ex: "14:00")
 * @returns Array de strings ["HH:mm", ...] com os horários válidos de início.
 */
export default function gerarHorariosComIntervalo(
  horaAbertura: string,
  horaFechamento: string,
  duracaoMinutos: number,
  inicioIntervalo: string,
  fimIntervalo: string
): string[] {
  // Converte tudo para minutos desde meia-noite:
  const aberturaMin = hhmmParaMinutos(horaAbertura);
  const fechamentoMin = hhmmParaMinutos(horaFechamento);
  const intervaloInicioMin = hhmmParaMinutos(inicioIntervalo);
  const intervaloFimMin = hhmmParaMinutos(fimIntervalo);

  const lista: string[] = [];
  let atual = aberturaMin;

  // Loop: enquanto um atendimento começando em ‘atual’ + duração caiba antes do fechamento:
  while (atual + duracaoMinutos <= fechamentoMin) {
    const fimAtendimento = atual + duracaoMinutos;

    // Verifica se há sobreposição com o intervalo de descanso:
    // Sobreposição acontece se o atendimento começar antes de intervaloFim
    // E terminar depois de intervaloInicio:
    const sobrepoeIntervalo =
      atual < intervaloFimMin && fimAtendimento > intervaloInicioMin;

    // Se não sobrepõe, é válido:
    if (!sobrepoeIntervalo) {
      lista.push(minutosParaHhmm(atual));
    }

    // Avança para o próximo bloco de `duracaoMinutos`
    atual += duracaoMinutos;
  }

  return lista;
}

// Exemplos de uso:

// 1) Barbearia abre das 09:00 às 19:30, atendimento de 60 min, pausa de 13:00 às 14:00
const horarios1hComPausa = gerarHorariosComIntervalo(
  "09:00",
  "19:30",
  60,
  "13:00",
  "14:00"
);
console.log(horarios1hComPausa);
// Resultado esperado:
// ["09:00", "10:00", "11:00", "12:00",         // antes da pausa
//  "14:00", "15:00", "16:00", "17:00", "18:00"] // depois da pausa

// 2) Exemplo com atendimento de 45min, abre 08:30, fecha 17:15, pausa 12:00–12:30
const horarios45min = gerarHorariosComIntervalo(
  "08:30",
  "17:15",
  45,
  "12:00",
  "12:30"
);
console.log(horarios45min);
// Exemplo de saída:
// [
//   "08:30", "09:15", "10:00", "10:45", "11:30", // antes da pausa
//   "12:30", "13:15", "14:00", "14:45", "15:30", "16:15" // depois da pausa
// ]
