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

            // BuyerLogisticsJob mappings
            CreateMap<CreateBuyerLogisticsJobDto, BuyerLogisticsJob>();
            CreateMap<BuyerLogisticsJob, BuyerLogisticsJobDto>();

            // Quote mappings
            CreateMap<CreateQuoteDto, BuyerLogisticsJobQuote>();
            CreateMap<BuyerLogisticsJobQuote, BuyerLogisticsJobQuoteDto>()
                .ForMember(dest => dest.LogisticsProviderName, opt => opt.MapFrom(src => src.LogisticsProvider != null ? src.LogisticsProvider.Username : "Unknown"))
                .ForMember(dest => dest.LogisticsProviderCompanyName, opt => opt.MapFrom(src => src.LogisticsProvider != null ? src.LogisticsProvider.CompanyName : null))
                .ForMember(dest => dest.LogisticsProviderMobile, opt => opt.MapFrom(src => src.LogisticsProvider != null ? src.LogisticsProvider.ContactNumber : null))
                .ForMember(dest => dest.LogisticsProviderEmail, opt => opt.MapFrom(src => src.LogisticsProvider != null ? src.LogisticsProvider.Email : null))
                .ForMember(dest => dest.JobPickupCity, opt => opt.MapFrom(src => src.Job != null ? src.Job.PickupCity : "Unknown"))
                .ForMember(dest => dest.JobDropCity, opt => opt.MapFrom(src => src.Job != null ? src.Job.DropCity : "Unknown"))
                .ForMember(dest => dest.JobStatus, opt => opt.MapFrom(src => src.Job != null ? src.Job.Status : "Unknown"))
                .ForMember(dest => dest.JobPickupAddressLine1, opt => opt.MapFrom(src => src.Job != null ? src.Job.PickupAddressLine1 : null))
                .ForMember(dest => dest.JobPickupAddressLine2, opt => opt.MapFrom(src => src.Job != null ? src.Job.PickupAddressLine2 : null))
                .ForMember(dest => dest.JobPickupState, opt => opt.MapFrom(src => src.Job != null ? src.Job.PickupState : null))
                .ForMember(dest => dest.JobPickupPincode, opt => opt.MapFrom(src => src.Job != null ? src.Job.PickupPincode : null))
                .ForMember(dest => dest.JobDropAddressLine1, opt => opt.MapFrom(src => src.Job != null ? src.Job.DropAddressLine1 : null))
                .ForMember(dest => dest.JobDropAddressLine2, opt => opt.MapFrom(src => src.Job != null ? src.Job.DropAddressLine2 : null))
                .ForMember(dest => dest.JobDropState, opt => opt.MapFrom(src => src.Job != null ? src.Job.DropState : null))
                .ForMember(dest => dest.JobDropPincode, opt => opt.MapFrom(src => src.Job != null ? src.Job.DropPincode : null))
                .ForMember(dest => dest.JobPickupDate, opt => opt.MapFrom(src => src.Job != null ? src.Job.PickupDate : default(DateTime)))
                .ForMember(dest => dest.JobDeliveryExpectedDate, opt => opt.MapFrom(src => src.Job != null ? src.Job.DeliveryExpectedDate : default(DateTime)))
                .ForMember(dest => dest.JobTotalWeight, opt => opt.MapFrom(src => src.Job != null ? src.Job.TotalWeight : 0))
                .ForMember(dest => dest.JobPalletCount, opt => opt.MapFrom(src => src.Job != null ? src.Job.PalletCount : 0))
                .ForMember(dest => dest.JobMaterialType, opt => opt.MapFrom(src => src.Job != null ? src.Job.MaterialType : null))
                .ForMember(dest => dest.JobLength, opt => opt.MapFrom(src => src.Job != null ? src.Job.Length : null))
                .ForMember(dest => dest.JobWidth, opt => opt.MapFrom(src => src.Job != null ? src.Job.Width : null))
                .ForMember(dest => dest.JobHeight, opt => opt.MapFrom(src => src.Job != null ? src.Job.Height : null))
                .ForMember(dest => dest.JobIsFragile, opt => opt.MapFrom(src => src.Job != null ? src.Job.IsFragile : false))
                .ForMember(dest => dest.JobIsHighValue, opt => opt.MapFrom(src => src.Job != null ? src.Job.IsHighValue : false));

            // Invoice mappings
            CreateMap<Invoice, InvoiceDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Order != null && src.Order.Product != null ? src.Order.Product.Name : null))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Order != null && src.Order.Product != null ? src.Order.Product.Quantity : 0))
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Order != null && src.Order.Product != null ? src.Order.Product.Unit : null))
                .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.Username : null))
                .ForMember(dest => dest.SupplierCompanyName, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.CompanyName : null))
                .ForMember(dest => dest.SupplierGSTNumber, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.GSTNumber : null))
                .ForMember(dest => dest.SupplierAddress, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.Address : null))
                .ForMember(dest => dest.SupplierContactNumber, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.ContactNumber : null))
                .ForMember(dest => dest.BuyerName, opt => opt.MapFrom(src => src.Buyer != null ? src.Buyer.Username : null))
                .ForMember(dest => dest.BuyerCompanyName, opt => opt.MapFrom(src => src.Buyer != null ? src.Buyer.CompanyName : null))
                .ForMember(dest => dest.BuyerGSTNumber, opt => opt.MapFrom(src => src.Buyer != null ? src.Buyer.GSTNumber : null))
                .ForMember(dest => dest.BuyerAddress, opt => opt.MapFrom(src => src.Buyer != null ? src.Buyer.Address : null));

        }
    }
}
