using AutoMapper;
using Backend.Models.Domain;
using Backend.Models.DTO;

namespace Backend.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<RegisterRequestDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); // Handled manually

            CreateMap<User, UserProfileDto>()
                .ForMember(dest => dest.AddressLine1, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.GSTCertificatePath, opt => opt.MapFrom(src => src.GSTCertificateUrl))
                .ForMember(dest => dest.PANCardPath, opt => opt.MapFrom(src => src.PANCardUrl));

            CreateMap<UpdateProfileDto, User>()
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.AddressLine1));

            CreateMap<ProductRequestDto, Product>();

            CreateMap<Product, ProductResponseDto>()
                .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.Username : null))
                .ForMember(dest => dest.SupplierCompanyName, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.CompanyName : null))
                .ForMember(dest => dest.SupplierContactPerson, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.ContactPerson : null))
                .ForMember(dest => dest.SupplierEmail, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.Email : null))
                .ForMember(dest => dest.SupplierContactNumber, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.ContactNumber : null));

            CreateMap<Negotiation, NegotiationDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : null))
                .ForMember(dest => dest.BuyerName, opt => opt.MapFrom(src => src.Buyer != null ? src.Buyer.Username : null))
                .ForMember(dest => dest.BuyerCompanyName, opt => opt.MapFrom(src => src.Buyer != null ? src.Buyer.CompanyName : null))
                .ForMember(dest => dest.BuyerEmail, opt => opt.MapFrom(src => src.Buyer != null ? src.Buyer.Email : null))
                .ForMember(dest => dest.BuyerContactNumber, opt => opt.MapFrom(src => src.Buyer != null ? src.Buyer.ContactNumber : null))
                .ForMember(dest => dest.SellerName, opt => opt.MapFrom(src => src.Seller != null ? src.Seller.Username : null));

            CreateMap<Offer, OfferDto>();

            // Old logistics mapping - commented out as LogisticsController was refactored
            // CreateMap<LogisticsEntry, LogisticsDto>()
            //     .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Order != null && src.Order.Product != null ? src.Order.Product.Name : null))
            //     .ForMember(dest => dest.ProviderName, opt => opt.MapFrom(src => src.Provider != null ? src.Provider.Username : null));

            CreateMap<Order, OrderDto>()
                 .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : null))
                 .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Product != null ? src.Product.Quantity : 0))
                 .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Product != null ? src.Product.Unit : ""))
                 .ForMember(dest => dest.BuyerName, opt => opt.MapFrom(src => src.Buyer != null ? src.Buyer.Username : null))
                 .ForMember(dest => dest.SellerName, opt => opt.MapFrom(src => src.Seller != null ? src.Seller.Username : null));

        }
    }
}
