
export interface RandomGradientBackgroundProps {
  children?: string
}

const RandomGradientBackground = (props: RandomGradientBackgroundProps) => {
  // 预定义一组渐变颜色
  const gradients = [
    ['#FDEB71', '#F8D800'],
    ['#ABDCFF', '#0396FF'],
    ['#FEB692', '#EA5455'],
    ['#90F7EC', '#32CCBC'],
    ['#FFF6B7', '#F6416C'],
    ['#81FBB8', '#28C76F'],
    ['#E2B0FF', '#9F44D3'],
    ['#F97794', '#623AA2'],
    ['#FCCF31', '#F55555'],
    ['#F761A1', '#8C1BAB'],
    ['#43CBFF', '#9708CC'],
    ['#5EFCE8', '#736EFE'],
    ['#FAD7A1', '#E96D71'],
    ['#FFD26F', '#3677FF'],
    ['#A0FE65', '#FA016D'],
    ['#FFDB01', '#0E197D'],
    ['#FEC163', '#DE4313'],
    ['#92FFC0', '#002661'],
    ['#EEAD92', '#6018DC'],
    ['#F6CEEC', '#D939CD'],
    ['#52E5E7', '#130CB7'],
    ['#F1CA74', '#A64DB6'],
    ['#E8D07A', '#5312D6'],
    ['#EECE13', '#B210FF'],
    ['#79F1A4', '#0E5CAD'],
    ['#FDD819', '#E80505'],
    ['#FFF3B0', '#CA26FF'],
    ['#FFF5C3', '#9452A5'],
    ['#F05F57', '#360940'],
    ['#2AFADF', '#4C83FF'],
    ['#FFF886', '#F072B6'],
    ['#97ABFF', '#123597'],
    ['#F5CBFF', '#C346C2'],
    ['#FFF720', '#3CD500'],
    ['#FF6FD8', '#3813C2'],
    ['#EE9AE5', '#5961F9'],
    ['#FFD3A5', '#FD6585'],
    ['#C2FFD8', '#465EFB'],
    ['#FD6585', '#0D25B9'],
    ['#FD6E6A', '#FFC600'],
    ['#65FDF0', '#1D6FA3'],
    ['#6B73FF', '#000DFF'],
    ['#FF7AF5', '#513162'],
    ['#F0FF00', '#58CFFB'],
    ['#FFE985', '#FA742B'],
    ['#FFA6B7', '#1E2AD2'],
    ['#FFAA85', '#B3315F'],
    ['#72EDF2', '#5151E5'],
    ['#FF9D6C', '#BB4E75'],
    ['#F6D242', '#FF52E5'],
    ['#69FF97', '#00E4FF'],
    ['#3B2667', '#BC78EC'],
    ['#70F570', '#49C628'],
    ['#3C8CE7', '#00EAFF'],
    ['#FAB2FF', '#1904E5'],
    ['#81FFEF', '#F067B4'],
    ['#FFA8A8', '#FCFF00'],
    ['#FFCF71', '#2376DD'],
    ['#FF96F9', '#C32BAC']
  ]

  // 随机选择一种渐变色
  const length = props.children?.length || 0
  const randomGradient = gradients[length > gradients.length - 1 ? 0 : length]

  // 设置渐变背景样式
  const gradientStyle = {
    borderRadius: 4,
    width: 42,
    height: 28,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000',
    background: `linear-gradient(135deg, ${randomGradient[0]}, ${randomGradient[1]})`,
    fontWeight: 'bolder',
    fontSize: 16
  }

  return (
    <div style={gradientStyle}>
      {props.children?.slice(0, 2)}
    </div>
  )
}

export default RandomGradientBackground
